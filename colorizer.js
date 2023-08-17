const getColors = require('get-image-colors');
const imageSize = require('image-size')
imageSize.disableFS(true);
const { GetColorName } = require('hex-color-to-color-name');
const { AceBase } = require('acebase');
const axios = require('axios');
let wdb = new AceBase('wall', {
    logLevel: 'error',
    path: "../data/"
});
let jobs = 0;
async function job(wall){
    if(wall.val().colors != undefined){
        jobs--;
        return console.log("Skipping "+wall.key+" because it already has colors");
    }
    let url = wall.val().url || wall.val().proxiedUrl;
    if(url == undefined) {
        jobs--;
        return;
    }
    let colors;
    let image;
    let size = {width: 0, height: 0};
    try{
        image = await axios.get(url, {responseType: 'arraybuffer'});
    } catch(e){
        console.log("Error getting image for "+wall.key);
        jobs--;
        return;
    }
    try{
        colors = await getColors(image.data, {
            type: (function(url){
                return 'image/'+url.split('.').pop();
                })(url),
            count: 5
        });
    } catch(e){
        console.log(e);
        console.log("Error getting colors for "+wall.key);
        jobs--;
        return;
    }
    try{
        size = imageSize(image.data);
    } catch(e){
        console.log("Error getting size for "+wall.key);
        jobs--;
        return;
    }
    if(colors == undefined) {
        jobs--;
        return console.log("Skipping "+wall.key+" because colors is undefined");
    }
    let hex = colors.map(color => color.hex());
    let select = [];    
    hex.forEach(element => {
        element = element.replace("#", "");
        let color = GetColorName(element);
        select.push(color);
    });
    wdb.ref("/walls/"+wall.key).update({
        colors: select,
        width: size.width,
        height: size.height
    });
    console.log("Updated "+wall.key+" with colors");
    jobs--;
}
wdb.on('ready', async () => {
    let lock = 1;
    //go thru all the walls and get the colors
    let data = await wdb.ref("/walls").forEach(async (wall) =>{
        if(lock && wall.key[0] == "1" && wall.key[1] == "s"){
            lock=0;
        }
        if(lock){
            return;
        }
        while(1){
            await new Promise(resolve => setTimeout(resolve, 200));
            if(jobs < 1){
                jobs++;
                job(wall);
                break;
            }
        }
    });
});
