var SelectCommand = require("../../app/commands/selectcommand");
var Game = require("../../app/game");
var Console = require("../../app/console");
var sinon = require("sinon");
var expect = require("chai").expect;

describe("SelectCommand", function(){
	var selectCommand, game, console;

	beforeEach(function(){
		game = new Game();
		console = new Console();
		selectCommand = new SelectCommand();
		selectCommand.game = game;
		selectCommand.console = console;
	});

	describe("#execute", function(){
		it("should set select entity for console", function(){
			var entity = {};
			game.getEntityNamed = sinon.stub().returns(entity).withArgs("name1");
			selectCommand.params = ["name1"];
			selectCommand.start();
			expect(console.selectedEntity).to.equal(entity);
		});
	});
});
