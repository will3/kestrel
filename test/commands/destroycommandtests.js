var DestroyCommand = require("../../app/commands/destroycommand");
var sinon = require("sinon");
var expect = require("chai").expect;
var Entity = require("../../app/entity");

describe("DestroyCommand", function(){
	var destroyCommand, game, mockGame, entities;

	beforeEach(function(){
		entities = [];
		destroyCommand = new DestroyCommand();
		game = {
			getEntities: function(){ return entities; },
			removeEntity: function(entity){ }
		};
		destroyCommand.setGame(game);
		mockGame = sinon.mock(game);
	})

	describe("#execute", function(){
		context("destroy all", function(){
			it("should remove destroyable entities", function(){
				var entity = new Entity();
				entity.destroyable = true;
				entities = [entity];
				destroyCommand.setParams(["all"]);
				mockGame.expects("removeEntity").withArgs(entity);

				destroyCommand.execute();

				mockGame.verify();
			})

			it("should ignore non destroyable entities", function(){
				var entity = new Entity();
				entity.destroyable = false;
				entities = [entity];
				destroyCommand.setParams(["all"]);
				mockGame.expects("removeEntity").never();

				destroyCommand.execute();

				mockGame.verify();
			})
		})

		context("destroy specific", function(){
			it("should remove entity with matching name", function(){
				var entity = new Entity();
				game.getEntity = sinon.stub().returns(entity).withArgs("test");
				destroyCommand.setParams(["test"]);
				mockGame.expects("removeEntity");

				destroyCommand.execute();

				mockGame.verify();
			})
		})
	})
})