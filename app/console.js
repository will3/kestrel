 var Console = function() {
    this.commandMapping = null;
    
    this.input = null;
    this.displayResult = false;
    this.result = null;
    this.lastCommand = null;
    this.selectedEntity = null;
}

Console.prototype = {
    constructor: Console,

    onKeyDown: function(e) {
        if (this.displayResult) {
            this.input.value = "";
            this.displayResult = false;
            return;
        }

        if (e.keyIdentifier == "Enter") {
            this.onEnterCommand(input.value);
            if (this.displayResult) {
                this.input.value = this.result;
            } else {
                this.input.value = "";
            }
        } else if (e.keyIdentifier == "Up") {
            if (this.lastCommand != null && this.lastCommand.length > 0) {
                this.input.value = this.lastCommand;
                this.displayResult = false;
            }
        }
    },

    onEnterCommand: function(command) {
        if (command.length == 0) {
            return;
        }

        this.lastCommand = command;
        var params = command.split(" ");

        this.processCommand(params);
    },

    getCommand: function(name) {
        var commandClass = this.commandMapping[name];
        if (commandClass == null) {
            throw name + " is not a valid command";
        }

        var command = new this.commandMapping[name]();

        return command;
    },

    processCommand: function(params) {
        var command = this.getCommand(params[0]);

        params.splice(0, 1);

        command.actor = this.selectedEntity;
        command.params = this.params;
        var resultBack = command.execute();

        if (resultBack != null && resultBack.length > 0) {
            result = resultBack;
            this.displayResult = true;
        }
    },

    setInput: function(value) {
        this.input = value;
        this.input.addEventListener('keydown', function(e) {
            this.onKeyDown(e);
        }.bind(this), false);
    },

    focus: function() {
        this.input.focus();
    },

    write: function(value) {
        this.input.value = value;
        this.displayResult = true;
    },

    run: function(command) {
        this.onEnterCommand(command);
    },

    runScenario: function(commands) {
        commands.forEach(function(command) {
            this.run(command);
        }.bind(this));
    }
};

module.exports = Console;