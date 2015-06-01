var sinon = require("sinon");
var chai = require("chai");
var expect = chai.expect;
var Console = require("../app/console");

describe('Console', function() {
    var console, input, mockInput, commandMapping, enterEvent, mockConsole;

    beforeEach(function() {
        console = new Console();
        input = {
            addEventListener: function() {},
            focus: function() {}
        };
        console.input = input;
        mockInput = sinon.mock(input);
        commandMapping = {};
        console.commandMapping = commandMapping;

        //mock command class
        var commandClass = function() {};
        commandClass.prototype = {
            constructor: commandClass,
            execute: function() {}
        };

        var command = {
            execute: function() {}
        };

        console.commandMapping = {
            valid_command: function() {
                return command;
            },
        };

        enterEvent = {};
        enterEvent.keyIdentifier = "Enter";

        mockConsole = sinon.mock(console);
    });

    describe("#onKeyUp", function() {
        it("should clear result if displaying results", function() {
            input.value = "result";
            console.displayResult = true;
            console.onKeyUp();
            expect(console.displayResult).to.be.false;
            expect(input.value).to.equal("");
        });

        it("should clear input when pressing enter", function() {
            input.value = "valid_command";
            console.onKeyUp(enterEvent);
            expect(input.value).to.equal("");
        });

        it("should process command when pressing enter", function() {
            input.value = "valid_command";
            var command = {};
            console.getCommand = sinon.stub().returns(command);
            mockConsole.expects("run").withArgs(command);
            console.onKeyUp(enterEvent);
            mockConsole.verify();
        });

        it("shouldn't process command if input is empty", function(){
            input.value = "";
            mockConsole.expects("run").never();
            console.onKeyUp(enterEvent);
            mockConsole.verify();
        })
    });

    describe('set Input', function() {
        it('should add event listener to input', function() {
            mockInput.expects("addEventListener").withArgs("keydown");
            console.hookInput(input);
            mockInput.verify();
        });
    });

    describe('focus', function() {
        it('should set focus on input', function() {
            mockInput.expects("focus");
            console.hookInput(input);
            console.focus();
            mockInput.verify();
        });
    });

    describe('write', function() {
        it('should print on input', function() {
            console.hookInput(input);
            console.write("hi");
            expect(input.value).to.equal("hi");
        });
    });

    describe('getCommand', function() {
        it('should throw if invalid command', function() {
            expect(function() {
                    console.getCommand("invalid_command");
                })
                .to
                .throw("invalid_command is not a valid command");
        });

        it('should return for valid command', function() {
            var command = console.getCommand("valid_command");
            expect(command).to.exist;
        });

        it('should map params', function() {
            var command = console.getCommand("valid_command param1 param2 param3");
            expect(command.params).to.eql(["param1", "param2", "param3"]);
        });

        it('should set actor', function() {
            var actor = {};
            console.selectedEntity = actor;
            var command = console.getCommand("valid_command");
            expect(command.actor).to.equal(actor);
        })
    });

    describe('run', function() {
        it("should execute command", function() {
            var command = {
                execute: function() {}
            };
            var mockCommand = sinon.mock(command);
            mockCommand.expects("execute");
            console.run(command);
            mockCommand.verify();
        });

        it("should write results if any", function() {
            var command = {
                execute: function() {
                    return "result";
                }
            }
            mockConsole.expects("write").withArgs("result");
            console.run(command);
            mockConsole.verify();
        });
    });

    describe("#runScenario", function() {
        it("should run commands in scenario", function() {
            console.getCommand = sinon.stub();

            var command1 = {
                execute: function() {}
            };
            var command2 = {
                execute: function() {}
            };

            var mockCommand1 = sinon.mock(command1);
            var mockCommand1 = sinon.mock(command2);

            console.getCommand.returns(command1);

            console.runScenario(["command1", "command2"]);
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