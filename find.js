//add discord selfbot
const fs = require('fs');
const { Client } = require('discord.js-selfbot-v13');
const client = new Client({
	// See other options here
	// https://discordjs-self-v13.netlify.app/#/docs/docs/main/typedef/ClientOptions
	// All partials are loaded automatically
});
let db = []; //hehehehehehhaw
const start = new Date().getTime();
client.on('ready', async () => {
    console.log(`${client.user.username} in ${client.readyTimestamp-start}ms`);
    startCollection();
});
function startCollection(){
    const channel = client.channels.cache.get("635625973764849684");
    channel.messages.fetch({ limit: 100 }).then(messages => {
        console.log(`Received ${messages.size} messages`);
        //Iterate through the messages here with the variable "messages".
        messages.forEach(message => {
            //log all images from messages
            if(message.attachments.size > 0){
                message.attachments.each(attachment => {
                    db.push({
                        url: attachment.url,
                        author: message.author.tag,
                        authorID: message.author.id,
                        messageID: message.id
                    });
                });
            }
            //also log all images from embeds
            if(message.embeds.length > 0){
                message.embeds.forEach(embed => {
                    if(embed.type == "image"){
                        db.push({
                            srcUrl: embed.url,
                            proxiedUrl: embed.thumbnail.proxyURL,
                            author: message.author.tag,
                            authorID: message.author.id,
                            messageID: message.id
                        });
                    }
                });
            }
        });
        console.log(db);
    });
}
client.login(fs.readFileSync(__dirname + '/token', 'utf8'));