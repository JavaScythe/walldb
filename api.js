const express = require('express');
const app = express();
const getColors = require('get-image-colors');
const { GetColorName } = require('hex-color-to-color-name');
const { AceBase } = require('acebase');
let wdb = new AceBase('wall', {
    logLevel: 'error',
    path: "../data/"
});
wdb.on('ready', async () => {
    await wdb.indexes.create('walls', 'number');
    await wdb.indexes.create('walls', 'colors');
    console.log("Indexes (indexi???) ready");
});
app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/web/index.html");
});
app.get("/api/retrieve", async (req,res)=>{
    let offset = req.query.offset;
    let limit = req.query.limit;
    if(offset == undefined || limit == undefined) return res.send("error");
    if(offset < 0) return res.send("error");
    if(limit < 0) return res.send("error");
    if(limit > 50) return res.send("error");
    limit = parseInt(limit);
    offset = parseInt(offset);
    let data = await wdb.query("/walls").filter("number", "between", [10000+offset, 10000+offset+limit]).get();
    res.send(JSON.stringify(data.getValues()));
});
app.get("/api/count", async (req,res)=>{
    let data = await wdb.ref("/walls").reflect('info', { child_count: true });
    res.send(data.children.count.toString());
});
app.get("/api/colorsort", async (req,res)=>{
    let color = req.query.color;
    if(color == undefined) return res.send("error");
    let data = await wdb.query("/walls").filter("colors", "contains", color).get();
    res.send(JSON.stringify(data.getValues()));
});
app.get("/api/color", async (req,res)=>{
    let url = req.query.url;
    if(url == undefined) return res.send("error");
    let colors = await getColors(url, {
        count: 5
    });
    let hex = colors.map(color => color.hex());
    let select = "";
    hex.forEach(element => {
        element = element.replace("#", "");
        let color = GetColorName(element);
        if(color == undefined) color = "unknown";
        select += color + " ";
        select += "<span style='background-color:#"+element+"'>#"+element+"</span> <br>";
    });
    res.send(select);
});
app.listen(3001);