var AttackCommand = require("../../app/commands/attackcommand");
var expect = require("chai").expect;
var sinon = require("sinon");
var Ship = require("../../app/entities/ship");
var ShipController = require("../../app/components/shipcontroller");
var THREE = require("THREE");
var Game = require("../../app/game");
var Entity = require("../../app/entity");

describe("Attack Command", function(){
	var attackCommand, actor, game, mockGame, target, weaponController, mockWeaponController;

	beforeEach(function(){
		attackCommand = new AttackCommand();
		actor = {};
		game = {};
		weaponController = {};
		attackCommand.setActor(actor);
		attackCommand.setGame(game);
		mockGame = sinon.mock(game);
		attackCommand.setActor(actor);
		weaponController = {
			setTarget: function(){ }
		}
		mockWeaponController = sinon.mock(weaponController);
		actor.getWeaponController = function(){
			return weaponController;
		}
	})

	describe("execute", function(){
		it("should parse target correctly", function(){
			game.getEntity = sinon.stub().returns(target).withArgs("test");
			attackCommand.setParams(["test"]);
			attackCommand.execute();
			expect(attackCommand.getTarget()).to.equal(target);
		})

		it("should issue command", function(){
			game.getEntity = sinon.stub().returns(target);
			attackCommand.setParams(["test"]);
			mockWeaponController.expects("setTarget").withArgs(target);
			attackCommand.execute();
			mockWeaponController.verify();
		})
	})
})