var THREE = require("THREE");
var EntityRunner = require("./entityrunner");
var Collision = require("./collision");
var MathUtils = require("./mathutils");
var Control = require("./control");
var _ = require("lodash");
var Console = require("./console");
var assert = require("assert");

var Game = function() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.control = null;
    this.target = new THREE.Vector3();
    //yaw pitch roll
    this.cameraRotation = new THREE.Vector3();
    this.distance = 400.0;
    this.frameRate = 60.0;
    this.keyboard = null;
    this.nameRegistry = {};
    this.stats = null;

    this.entityRunner = null;
    this.collision = null;
}

Game.prototype = {
    constructor: Game,

    onEnterFrame: function() {
        this.entityRunner.run();
    },

    updateCamera: function() {
        var yaw = this.cameraRotation.x;
        var pitch = this.cameraRotation.y;
        var roll = this.cameraRotation.z;
        var matrix = MathUtils.getRotationMatrix(yaw, pitch, roll);
        var unitZ = new THREE.Vector3(0, 0, 1);
        unitZ.applyMatrix4(matrix);
        unitZ.setLength(distance);

        var position = new THREE.Vector3();
        position.subVectors(target, unitZ);

        this.camera.position.set(position.x, position.y, position.z);
        this.camera.lookAt(target);
        this.camera.updateMatrix();
    },

    initScene: function() {
        var WIDTH = container.clientWidth,
            HEIGHT = container.clientHeight;

        var VIEW_ANGLE = 45,
            ASPECT = WIDTH / HEIGHT,
            NEAR = 0.1,
            FAR = 10000;

        renderer = new THREE.WebGLRenderer();
        camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR);

        scene = new THREE.Scene();

        renderer.setSize(WIDTH, HEIGHT);

        container.appendChild(renderer.domElement);

        render();

        this.cameraRotation.set(Math.PI / 4.0, Math.PI / 4.0);

        updateCamera();

        scene.add(camera);

        THREEx.WindowResize(renderer, camera);

        keyboard = new THREEx.KeyboardState(renderer.domElement);
        renderer.domElement.setAttribute("tabIndex", "0");
        renderer.domElement.focus();

        // only on keyup
        var KeyMap = Control.KeyMap;
        keyboard.domElement.addEventListener('keyup', function(event) {
            if (keyboard.eventMatches(event, KeyMap.console)) {
                Console.focus();
            } else if (keyboard.eventMatches(event, KeyMap.zoomIn)) {
                zoomIn();
            } else if (keyboard.eventMatches(event, KeyMap.zoomOut)) {
                zoomOut();
            }
        });
    },

    zoomIn: function() {
        distance /= 1.2;
        updateCamera();
    },

    zoomOut: function() {
        distance *= 1.2;
        updateCamera();
    },

    mouseMove: function(xDiff, yDiff) {
        var yVector = new THREE.Vector3(target.x - camera.position.x, 0, target.z - camera.position.z);
        var m = MathUtils.getRotationMatrix(Math.PI / 2.0, 0, 0);
        var xVector = new THREE.Vector3();
        xVector.copy(yVector);
        xVector.applyMatrix4(m);

        xVector.normalize();
        yVector.normalize();

        target.addVectors(target, xVector.multiplyScalar(xDiff / 2.0));
        target.addVectors(target, yVector.multiplyScalar(yDiff / 2.0));

        updateCamera();
    },

    mouseRotate: function(xDiff, yDiff) {
        this.cameraRotation.x += -xDiff / 100.0;
        this.cameraRotation.y += yDiff / 100.0;

        if (this.cameraRotation.y > Math.PI / 2.0) {
            this.cameraRotation.y = Math.PI / 2.0;
        } else if (this.cameraRotation.y < -Math.PI / 2.0) {
            this.cameraRotation.y = -Math.PI / 2.0;
        }

        updateCamera();
    },

    initControl: function() {
        control = new Control();
        control.hookContainer(container);

        control.mousemove(function(xDiff, yDiff) {
            mouseRotate(xDiff, yDiff);
        });
    },

    render: function() {
        if (stats != null) {
            stats.begin();
        }
        renderer.render(scene, camera);
        if (stats != null) {
            stats.end();
        }
        requestAnimationFrame(render);
    },

    initialize: function(container) {
        assert(this.control != null, "control cannot be empty");
        assert(this.entityRunner != null, "entityRunner cannot be empty");
        assert(this.collision != null, "collision cannot be empty");

        initScene();
        initControl();
        this.addEntity(collision);
        setInterval(onEnterFrame, 1000 / frameRate);
    },

    addEntity: function(entity, position) {
        if (position != null) {
            entity.setPosition(position);
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
