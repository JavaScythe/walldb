const wall = [
    "wallpapers",
    "walls",
    "backgrounds",
    "backs",
    "fehs",
    "backdrops",
    "papers"
];
document.getElementById("wallname").textContent = wall[(function(){
    return Math.floor(Math.random() * (wall.length-1));
})()]