var DestroyCommand = require("../../app/commands/destroyCommand");
var sinon = require("sinon");
var expect = require("chai").expect;

describe("DestroyCommand", function(){
	var destroyCommand, game;

	beforeEach(function(){
		destroyCommand = new DestroyCommand();
		game = {};
		destroyCommand.setGame(game);
	})

	describe("#execute", function(){
		
	})
})