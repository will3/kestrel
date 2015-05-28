var Console = function() {
    this.commandMapping = null;

    this.input = null;
    this.displayResult = false;
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
            if (this.input.value.length == 0) {
                return;
            }

            var command = this.getCommand(this.input.value);
            this.run(command);
            
            this.input.value = "";
        }
    },

    hookInput: function(value) {
        this.input = value;
        this.input.addEventListener('keydown', function(e) {
            this.onKeyDown(e);
        }.bind(this), false);
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
        command.params = params;
        command.actor = this.selectedEntity;

        return command
    },

    run: function(command) {
        var result = command.execute();
        if(result != null){
            this.write(result);
        }
    },

    focus: function() {
        this.input.focus();
    },

    write: function(value) {
        this.input.value = value;
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