var THREE = require("THREE");
var EntityRunner = require("./entityrunner");
var Collision = require("./collision");
var MathUtils = require("./mathutils");
var Control = require("./control");
var _ = require("lodash");
var Console = require("./console");
var assert = require("assert");
var Mousetrap = require("Mousetrap");

var Game = function() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.control = null;
    this.target = new THREE.Vector3();
    //yaw pitch roll
    this.cameraRotation = new THREE.Vector3();
    this.distance = 600.0;
    this.frameRate = 60.0;
    this.keyboard = null;
    this.nameRegistry = {};
    this.stats = null;
    this.console = null;

    this.entityRunner = null;
    this.keyMap = null;
    this.collision = null;
    this.container = null;
}

Game.getInstance = function(){
    if(Game.instance == null){
        Game.instance = new Game();
    }

    return Game.instance;
}

Game.prototype = {
    constructor: Game,

    onEnterFrame: function() {
        this.entityRunner.run();
    },

    updateCamera: function() {
        var yaw = this.cameraRotation.y;
        var pitch = this.cameraRotation.x;
        var roll = this.cameraRotation.z;
        var matrix = MathUtils.getRotationMatrix(yaw, pitch, roll);
        var unitZ = new THREE.Vector3(0, 0, 1);
        unitZ.applyMatrix4(matrix);
        unitZ.setLength(this.distance);

        var position = new THREE.Vector3();
        position.subVectors(this.target, unitZ);

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

        Mousetrap.bind('`', function() {
            this.console.focus();
        }.bind(this), 'keyup');
    },

    zoomIn: function() {
        this.distance /= 1.2;
        this.updateCamera();
    },

    zoomOut: function() {
        this.distance *= 1.2;
        this.updateCamera();
    },

    moveCamera: function(xDiff, yDiff) {
        var yVector = new THREE.Vector3(this.target.x - this.camera.position.x, 0, this.target.z - this.camera.position.z);
        var m = MathUtils.getRotationMatrix(Math.PI / 2.0, 0, 0);
        var xVector = new THREE.Vector3();
        xVector.copy(yVector);
        xVector.applyMatrix4(m);

        xVector.normalize();
        yVector.normalize();

        this.target.add(xVector.multiplyScalar(xDiff / 2.0));
        this.target.add(yVector.multiplyScalar(yDiff / 2.0));

        this.updateCamera();
    },

    rotateCamera: function(xDiff, yDiff) {
        this.cameraRotation.y += -xDiff * 0.01;
        this.cameraRotation.x += yDiff * 0.01;

        if (this.cameraRotation.x > Math.PI / 2.0) {
            this.cameraRotation.x = Math.PI / 2.0;
        } else if (this.cameraRotation.x < -Math.PI / 2.0) {
            this.cameraRotation.x = -Math.PI / 2.0;
        }

        this.updateCamera();
    },

    initControl: function() {
        this.control.hookContainer(this.container);

        this.control.mouseMove(function(xDiff, yDiff) {
            this.rotateCamera(xDiff, yDiff);
        }.bind(this));
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
        assert(this.control != null, "control cannot be empty");
        assert(this.entityRunner != null, "entityRunner cannot be empty");
        assert(this.collision != null, "collision cannot be empty");

        this.container = container;
        this.initScene();
        this.initControl();
        this.collision.game = this;
        this.addEntity(this.collision);
        setInterval(this.onEnterFrame.bind(this), 1000 / this.frameRate);
    },

    addEntity: function(entity, position) {
        if (position != null) {
            entity.position = position;
        }

        this.entityRunner.addEntity(entity);
    },

    removeEntity: function(entity) {
        entity.destroy();
        this.entityRunner.removeEntity(entity);
    },

    getEntity: function(name) {
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