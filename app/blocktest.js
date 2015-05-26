var THREE = require("THREE");
var BlockChunk = require("./blockengine/blockchunk");
var BlockCoord = require("./blockengine/blockcoord");
var Block = require("./blockengine/block");
var BlockRange = require("./blockengine/blockrange");
var BlockModel = require("./blockmodel");
var control = require('./control');

var stats = new Stats();
stats.setMode(0);

stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild(stats.domElement);

var container, camera, scene, renderer, object;

var blockChunk = new BlockChunk();

var blockRange = new BlockRange(new BlockCoord(0, 0, 0), new BlockCoord(20, 20, 20));
blockRange.visit(function(x, y, z){    
    blockChunk.addBlock(x, y, z, new Block());
});

// blockChunk.addBlock(0, 3, 0, new Block());
// blockChunk.addBlock(1, 2, 0, new Block());
// blockChunk.addBlock(2, 1, 0, new Block());
// blockChunk.addBlock(3, 2, 0, new Block());
// blockChunk.addBlock(4, 3, 0, new Block());
// blockChunk.addBlock(0, 4, 0, new Block());
// blockChunk.addBlock(4, 4, 0, new Block());
// blockChunk.addBlock(1, 5, 0, new Block());
// blockChunk.addBlock(3, 5, 0, new Block());
// blockChunk.addBlock(2, 4, 0, new Block());

blockChunk.shrink();
blockChunk.subdivide();
blockChunk.reallocate();

var blockModel = new BlockModel(blockChunk);
blockModel.initGeometry();
var geometry = blockModel.geometry;

init();
animate();

function init() {
    container = document.getElementById('container');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 200;
    scene.add(camera);

    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });

    object = new THREE.Object3D();
    scene.add(object);

    for(var i in blockModel.geometries){
        var geometry = blockModel.geometries[i];
        var cube = new THREE.Mesh(geometry, material);
        object.add(cube);
    }
    
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
    object.rotation.y += 0.005;
    renderer.render(scene, camera);
}
