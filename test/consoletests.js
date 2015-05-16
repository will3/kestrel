var sinon = require("sinon");
var chai = require("chai");
var ListCommand = require("../app/commands/listcommand");
var Command = require("../app/command");
var expect = chai.expect;

describe('Console', function(){
	var console = null;

	beforeEach(function(){
		console = require("../app/console");
	});

	describe('set Input', function(){
		it('should add event listener to input', function(){
			var mock = mockInput();
		    mock.expects("addEventListener").once().withArgs("keydown");

		    console.setInput(mock.object);
			
			mock.verify();
		});
	});

	describe('focus', function(){
		it('should set focus on input', function(){
			var mock = mockInput();
			mock.expects("focus");

			console.setInput(mock.object);
			console.focus();

			mock.verify();
		});
	});

	describe('write', function(){
		it('should print on input', function(){
			var mock = mockInput();

			console.setInput(mock.object);
			console.write("hi");

			expect(mock.object.value).to.equal("hi");
		});
	});

	describe('run', function(){
		it('should throw if invalid command', function(){
			expect(function(){
				console.run("invalid_command");
			})
			.to
			.throw("invalid_command is not a valid command");
		});

		it('should not throw for list', function(){
			console.setCommandMapping({
				"list": 	ListCommand,
			});

			console.run("list");
		});
	});

	function mockInput(){
		var input = {
			addEventListener: function(){},
			focus: function(){},
		};
		input.type = "text";
		return sinon.mock(input);
	}
});
