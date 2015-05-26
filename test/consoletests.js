var sinon = require("sinon");
var chai = require("chai");
var expect = chai.expect;
var Console = require("../app/console");

describe('Console', function() {
    var console, input, mockInput, commandMapping;

    beforeEach(function() {
    	console = new Console();
        input = {
            addEventListener: function() {},
            focus: function() {}
        };
        mockInput = sinon.mock(input);
        commandMapping = {};
        console.commandMapping = commandMapping;
    });

    describe('set Input', function() {
        it('should add event listener to input', function() {
            mockInput.expects("addEventListener").withArgs("keydown");
            console.setInput(input);
            mockInput.verify();
        });
    });

    describe('focus', function() {
        it('should set focus on input', function() {
            mockInput.expects("focus");
            console.setInput(input);
            console.focus();
            mockInput.verify();
        });
    });

    describe('write', function() {
        it('should print on input', function() {
            console.setInput(input);
            console.write("hi");
            expect(input.value).to.equal("hi");
        });
    });

    describe('run', function() {
        it('should throw if invalid command', function() {
            expect(function() {
                    console.run("invalid_command");
                })
                .to
                .throw("invalid_command is not a valid command");
        });

        it('should not throw for valid command', function() {
        	//mock command class
        	var commandClass = function(){};
        	commandClass.prototype = {
        		constructor: commandClass,
        		execute: function(){}
        	};

            console.commandMapping = {
                "list": commandClass,
            };

            console.run("list");
        });
    });

    function mockInput() {
        var input = {
            addEventListener: function() {},
            focus: function() {},
        };
        input.type = "text";
        return sinon.mock(input);
    }
});