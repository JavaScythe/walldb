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
wdb.on('ready', async () => {
    //go thru all the walls and get the colors
    let data = await wdb.ref("/walls").forEach(async (wall) =>{
        if(wall.val().colors != undefined) return console.log("Skipping "+wall.key+" because it already has colors");
        let url = wall.val().url || wall.val().proxiedUrl;
        if(url == undefined) return;
        let colors;
        let image;
        let size = {width: 0, height: 0};
        try{
            image = await axios.get(url, {responseType: 'arraybuffer'});
        } catch(e){
            console.log("Error getting image for "+wall.key);
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
            return;
        }
        try{
            size = imageSize(image.data);
        } catch(e){
            console.log("Error getting size for "+wall.key);
            return;
        }
        if(colors == undefined) return console.log("Skipping "+wall.key+" because colors is undefined");
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
    });
});
