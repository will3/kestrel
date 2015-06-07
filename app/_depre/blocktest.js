var THREE = require("THREE");
var BlockChunk = require("./blockengine/blockchunk");
var BlockCoord = require("./blockengine/blockcoord");
var BlockModel = require("./blockengine/blockmodel");
var Block = require("./blockengine/block");
var Control = require('./control');
var TestBlock = require("./testblock");

var stats = new Stats();
stats.setMode(0);

stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild(stats.domElement);

var container = document.getElementById('container');
var camera, scene, renderer, object;

var testSize = 32;
var blockModel = new BlockModel(512);
for (var x = 0; x < testSize; x++) {
    for (var y = 0; y < testSize; y++) {
        for (var z = 0; z < testSize; z++) {
            blockModel.add(x, y, z, new TestBlock());
        }
    }
}

var control = new Control();
control.hookContainer(container);
control.mouseMove(function(xDiff, yDiff) {
    object.rotation.y += xDiff * 0.1;
    object.rotation.x += yDiff * 0.1;
});

var removeX = 0;
var removeY = 0;
var removeZ = 0;
var allRemoved = false;

Mousetrap.bind('space', function(){
    if(allRemoved){
        return;
    }

    blockModel.remove(removeX, removeY, removeZ);

    if(removeX < testSize - 1){
        removeX ++;
    }else if(removeY < testSize - 1){
        removeX = 0;
        removeY ++;
    }else if(removeZ < testSize - 1){
        removeX = 0;
        removeY = 0;
        removeZ ++;
    }else{
        allRemoved = true;
    }
});


init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 50;
    scene.add(camera);

    object = blockModel.object;

    scene.add(object);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);

    stats.begin();
    render();
    stats.end();
}

function render() {
    // object.rotation.y += 0.005;
    blockModel.update();
    renderer.render(scene, camera);
}