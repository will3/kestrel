var AttackCommand = require("../../app/commands/AttackCommand");
var expect = require("chai").expect;
var sinon = require("sinon");
var Ship = require("../../app/entities/Ship");
var ShipController = require("../../app/components/ShipController");
var THREE = require("THREE");
var Game = require("../../app/Game")

describe("Attack Command", function(){
	var attackCommand, actor, shipController, mockShipController, target, game;

	beforeEach(function(){
		attackCommand = new AttackCommand();
		actor = new Ship();
		shipController = new ShipController();
		mockShipController = sinon.mock(shipController);
		attackCommand.setActor(actor);
		actor.setShipController = shipController;
		target = new Ship();
		game = new Game.constructor();
	})

	describe("execute", function(){
		//todo
		it("should parse target correctly", function(){

		})

		//todo
		it("should issue command", function(){
			
		})
	})

	describe("update", function(){
		//todo
	})

	describe("shoot", function(){
		//todo
	})
})