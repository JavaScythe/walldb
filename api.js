const express = require('express');
const app = express();
const { AceBase } = require('acebase');
let wdb = new AceBase('wall', {
    logLevel: 'error',
    path: "../data/"
});
app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/web/index.html");
});
app.get("/api/retrive", async (req,res)=>{
    let offset = req.query.offset;
    let limit = req.query.limit;
    if(offset == undefined || limit == undefined) return res.send("error");
    if(offset < 0) return res.send("error");
    if(limit < 0) return res.send("error");
    if(limit > 50) return res.send("error");
    //each wall is indexed by it's id
    let data = await wdb.ref("/walls").query().skip(offset).take(limit).get();
    res.send(JSON.stringify(data.getValues()));
    delete data;
});
app.get("/api/count", async (req,res)=>{
    let data = await wdb.ref("/walls").get();
    res.send(data.numChildren().toString());
    delete data;
});
app.listen(3000);