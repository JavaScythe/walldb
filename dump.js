const { AceBase } = require('acebase');
let db = new AceBase('wall', {
    logLevel: 'error', // should prob change in prod
    //@ts-ignore //acebase doesn't like this
    path: "../data/"
});
db.ready(async () => {
    //https://github.com/appy-one/acebase#iterating-streaming-children
    let b = await db.ref('/walls').get();
    console.log(Object.keys(b.val()).length);
    return true;
    db.ref('/').forEach(wall => {
        const w = wall.val();
        console.log(wall.key+": "+w.url || w.proxiedUrl);
     });
    //ref.set({"joe": 2323});
});