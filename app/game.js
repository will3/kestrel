var THREE = require("THREE");
var EntityRunner = require("./entityrunner");
var MathUtils = require("./mathutils");
var Control = require("./control");
var _ = require("lodash");
var Console = require("./console");
var CANNON = require("CANNON");
var Collision = require("./collision");
require("seedrandom");

var Game = function() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.target = new THREE.Vector3();
    this.cameraRotation = new THREE.Euler();
    this.cameraRotation.order = 'YXZ';
    this.distance = 400.0;
    this.frameRate = 48.0;
    this.keyboard = null;
    this.nameRegistry = {};
    this.stats = null;

    this.entityRunner = new EntityRunner();
    this.keyMap = null;
    this.collision = new Collision();
    this.container = null;
    this.world = new CANNON.World();
    this.position = new THREE.Vector3(0, 0, 0);
    this.rotationMatrix = new THREE.Matrix4();
    this.transformMatrix = new THREE.Matrix4();
    this.worldTransformMatrix = new THREE.Matrix4();
    this.control = new Control();
}

Game._instance = null;
Game.getInstance = function() {
    if (Game._instance == null) {
        Game._instance = new Game();
    }
    return Game._instance;
}

Game.prototype = {
    constructor: Game,

    seedRandom: function(seed){
        Math.seedrandom(seed);
    },

    getCameraRaycaster: function() {
        var raycaster = new THREE.Raycaster();
        var coords = new THREE.Vector2();
        coords.x = (this.control.mouseX / this.container.width()) * 2 - 1;
        coords.y = -(this.control.mouseY / this.container.height()) * 2 + 1;

        raycaster.setFromCamera(coords, this.camera);

        return raycaster;
    },

    onEnterFrame: function() {
        this.entityRunner.run();
    },

    updateCamera: function() {
        var yaw = this.cameraRotation.y;
        var pitch = this.cameraRotation.x;
        var roll = this.cameraRotation.z;
        var unitVector = MathUtils.getUnitVector(this.cameraRotation);
        unitVector.setLength(this.distance);

        var position = new THREE.Vector3();
        position.subVectors(this.target, unitVector);

        this.camera.position.set(position.x, position.y, position.z);
        this.camera.lookAt(this.target);
        this.camera.updateMatrix();
    },

    initScene: function() {
        var WIDTH = this.container.width(),
            HEIGHT = this.container.height();

        var VIEW_ANGLE = 45,
            ASPECT = WIDTH / HEIGHT,
            NEAR = 0.1,
            FAR = 10000;

        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR);

        this.scene = new THREE.Scene();

        this.renderer.setSize(WIDTH, HEIGHT);

        this.container.append(this.renderer.domElement);

        this.render();

        this.cameraRotation.set(Math.PI / 4.0, Math.PI / 4.0, 0);

        this.updateCamera();

        this.scene.add(this.camera);

        THREEx.WindowResize(this.renderer, this.camera);
    },

    zoomIn: function() {
        this.distance /= 1.2;
        this.updateCamera();
    },

    zoomOut: function() {
        this.distance *= 1.2;
        this.updateCamera();
    },

    initControl: function() {
        this.control.hookContainer(this.container);
    },

    render: function() {
        if (this.stats != null) {
            this.stats.begin();
        }
        this.renderer.render(this.scene, this.camera);
        if (this.stats != null) {
            this.stats.end();
        }
        requestAnimationFrame(this.render.bind(this));
    },

    initialize: function(container) {
        this.container = container;
        this.initScene();
        this.initControl();
        this.addEntity(this.collision);
        this.addEntity(this.control);
        setInterval(this.onEnterFrame.bind(this), 1000 / this.frameRate);
    },

    addEntity: function(entity) {
        entity.parent = this;
        this.entityRunner.addEntity(entity);
    },

    removeEntity: function(entity) {
        entity.destroy();
        entity.parent = null;
        this.entityRunner.removeEntity(entity);
    },

    getEntityNamed: function(name) {
        var entities = this.getEntities({
            name: name
        });
        if (entities == null || entities.length == 0) {
            throw "cannot find entity with name: " + name;
        }

        if (entities.length > 1) {
            throw "more than one entity with name: " + name + " found";
        }

        return entities[0];
    },

    getEntities: function(params) {
        var entities = this.entityRunner.entities;

        if (params == null) {
            return entities;
        }

        var name = params == null ? null : params.name;

        if (name != null) {
            entities = _.filter(entities, function(e) {
                return e.name == name;
            });
        }

        return entities;
    },

    nameEntity: function(name, entity) {
        if (this.nameRegistry[name] == undefined) {
            this.nameRegistry[name] = 0;
        } else {
            this.nameRegistry[name] = this.nameRegistry[name] + 1;
        }

        entity.name = name + this.nameRegistry[name];
    }
}

module.exports = Game;