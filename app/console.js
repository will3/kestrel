var Console = function(commandMapping) {
    this.commandMapping = commandMapping || {};

    this.input = null;
    this.displayResult = false;
    this.lastCommand = null;
    this.selectedEntity = null;
}

Console._instance = null;
Console.getInstance = function() {
    if (Console._instance == null) {
        Console._instance = new Console();
    }

    return Console._instance;
}

Console.prototype = {
    constructor: Console,

    onKeyUp: function(e) {
        if (this.displayResult) {
            this.input.val("");
            this.displayResult = false;
            return;
        }

        if (e.keyCode == 13) {
            if (this.input.val().length == 0) {
                return;
            }

            var command = this.getCommand(this.input.val());
            this.run(command);
        }
    },

    hookInput: function(value) {
        this.input = value;
        this.input.keyup(function(e) {
            this.onKeyUp(e);
        }.bind(this));
    },

    getCommand: function(inputValue) {
        this.lastCommand = inputValue;
        var params = inputValue.split(" ");

        var commandName = params[0];
        if (this.commandMapping[commandName] == null) {
            throw commandName + " is not a valid command";
        }


        var command = this.commandMapping[commandName]();
        params.splice(0, 1);
        command.actor = this.selectedEntity;
        command.setParams(params);

        return command
    },

    run: function(command) {
        var result = command.start();
        if(command.hasActor){
            this.selectedEntity.issueCommand(command);
        }

        if (result != null) {
            this.write(result);
        } else {
            if (this.input != null) {
                this.input.val("");
            }
        }
    },

    focus: function() {
        this.input.focus();
    },

    write: function(value) {
        this.input.val(value);
        this.displayResult = true;
    },

    runScenario: function(inputValues) {
        inputValues.forEach(function(inputValue) {
            var command = this.getCommand(inputValue);
            this.run(command);
        }.bind(this));
    }
};

module.exports = Console;