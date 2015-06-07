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

	describe("start", function(){
		it("should parse target correctly", function(){
			game.getEntityNamed = sinon.stub().returns(target).withArgs("test");
			attackCommand.params = ["test"];
			attackCommand.start();
			expect(attackCommand.target).to.equal(target);
		});
	})
})