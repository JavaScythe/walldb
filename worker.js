//it's not a sw. i trolled github copilot.
//add discord selfbot
const fs = require('fs');
const idrm = require('short-unique-id');
const idr = new idrm({ length: 10 });
const { AceBase } = require('acebase');
let wdb = new AceBase('wall', {
    logLevel: 'error',
    path: "../data/"
});
const { Client } = require('discord.js-selfbot-v13');
const client = new Client({});
const start = new Date().getTime();
client.on('ready', async () => {
    console.log(`${client.user.username} in ${client.readyTimestamp-start}ms`);
});
//635625973764849684
client.on('messageCreate', async message => {
    if(message.channel.id != "635625973764849684") return;
    if(message.attachments.size > 0){
        message.attachments.each(attachment => {
            upload({
                url: attachment.url,
                authorID: message.author.id,
                messageID: message.id
            });
            console.log("added");
        });
    }
    //also log all images from embeds
    if(message.embeds.length > 0){
        message.embeds.forEach(embed => {
            if(embed.type == "image"){
                if(embed.thumbnail == undefined) return;
                upload({
                    srcUrl: embed.url,
                    proxiedUrl: embed.thumbnail.proxyURL,
                    authorID: message.author.id,
                    messageID: message.id
                });
                console.log("added");
            }
        });
        
    }
});
async function upload(json){
    let id = idr();
    console.log(json);
    //wdb.ref(id).set(json);
}
client.login(fs.readFileSync(__dirname + '/token', 'utf8'));