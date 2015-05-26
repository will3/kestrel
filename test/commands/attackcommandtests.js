var AttackCommand = require("../../app/commands/attackcommand");
var expect = require("chai").expect;
var sinon = require("sinon");

describe("Attack Command", function(){
	var attackCommand, actor, game, mockGame, target, weaponController, mockWeaponController;

	beforeEach(function(){
		attackCommand = new AttackCommand();
		actor = {};
		game = {};
		weaponController = {};
		attackCommand.actor = actor;
		attackCommand.game = game;
		mockGame = sinon.mock(game);
		attackCommand.actor = actor;
		weaponController = {
			setTarget: function(){ }
		}
		actor.weaponController = weaponController;
		mockWeaponController = sinon.mock(weaponController);
		actor.getWeaponController = function(){
			return weaponController;
		}
	})

	describe("execute", function(){
		it("should parse target correctly", function(){
			game.getEntity = sinon.stub().returns(target).withArgs("test");
			attackCommand.params = ["test"];
			attackCommand.execute();
			expect(attackCommand.target).to.equal(target);
		})

		it("should issue command", function(){
			game.getEntity = sinon.stub().returns(target);
			attackCommand.params = ["test"];
			mockWeaponController.expects("setTarget").withArgs(target);
			attackCommand.execute();
			mockWeaponController.verify();
		})
	})
})