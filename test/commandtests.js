var Command = require("../app/command");
var sinon = require("sinon");
var expect = require("chai").expect;

describe("Command", function(){
	var command;

	beforeEach(function(){
		command = new Command();
	})

	describe("#execute", function(){
		it("must override", function(){
			expect(function(){
				command.execute();
			}).to.throw("must override");
		})
	})

	describe("#update", function(){
		it("must override", function(){
			expect(function(){
				command.update();
			}).to.throw("must override");
		})
	})
})