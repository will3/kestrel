var DestroyCommand = require("../../app/commands/destroycommand");
var sinon = require("sinon");
var expect = require("chai").expect;

describe("DestroyCommand", function(){
	var destroyCommand, game, mockGame, entities;

	beforeEach(function(){
		entities = [];
		destroyCommand = new DestroyCommand();
		game = {
			getEntities: function(){ return entities; },
			removeEntity: function(entity){ }
		};
		destroyCommand.game = game;
		mockGame = sinon.mock(game);
	})

	describe("#start", function(){
		context("destroy specific", function(){
			it("should remove entity with matching name", function(){
				var entity = {};
				game.getEntityNamed = sinon.stub().returns(entity).withArgs("test");
				destroyCommand.params = ["test"];
				mockGame.expects("removeEntity");

				destroyCommand.start();

				mockGame.verify();
			})
		})
	})
})