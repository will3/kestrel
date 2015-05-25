var Game = require("./game");
var EntityRunner = require("./entityrunner");
var Collision = require("./collision");
var ShipController = require("./components/shipcontroller");
var WeaponController = require("./components/weaponcontroller");
var BaseModule = require("./basemodule");
var Weapon = require("./entities/weapon");
var SmokeTrail = require("./entities/smokeTrail");
var BlockRenderComponent = require("./components/blockrendercomponent");

var AppModule = function(){

}

AppModule.prototype = Object.create(BaseModule);
AppModule.prototype.constructor = AppModule;

AppModule.prototype.load = function(){
	this.bind("game").to(new Game());
	this.bind("entityRunner").to(new EntityRunner());
	this.bind("collision").to(function(){
		return new Collision();
	});

	this.bind("shipController").to(function(){
		return new ShipController();
	});

	this.bind("weaponController").to(function(){
		return new WeaponController();
	});

	this.bind("rigidBody").withTag("ship").to(function(){
        var rigidBody = new RigidBody();
        rigidBody.setCollisionRadius(9);
		return rigidBody;
	});

	this.bind("weapons").to(function(){
        var laser = new Laser();
        // var missile = new Missile();

        weapons = [];

        var weapon1 = new Weapon(laser);
        weapon1.setActor(this);
        weapon1.setDelta(0);
        weapons.push(weapon1);

        var weapon2 = new Weapon(laser);
        weapon2.setActor(this);
        weapon2.setDelta(8);
        weapons.push(weapon2);

        return weapons;
	});

	this.bind("smokeTrail").to(function(){
		return new SmokeTrail();
	});

	this.bind("renderComponent").withTag("ship").to(function(){
		return new BlockRenderComponent();
	});
}

module.exports = new AppModule();