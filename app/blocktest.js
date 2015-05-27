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

var blockChunk = new BlockChunk(new BlockCoord(0, 0, 0), 32);

for (var x = 0; x < 4; x++) {
    for (var y = 0; y < 4; y++) {
        for (var z = 0; z < 4; z++) {
            blockChunk.add(x, y, z, new TestBlock());
        }
    }
}

var blockModel = new BlockModel(blockChunk);
blockModel.initObject();

var control = new Control();
control.hookContainer(container);
control.mouseMove(function(xDiff, yDiff) {
    object.rotation.y += xDiff * 0.1;
    object.rotation.x += yDiff * 0.1;
});

control.mouseClick(function() {
    blockModel.add(4, 4, 4, new TestBlock());
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
    renderer.render(scene, camera);
}