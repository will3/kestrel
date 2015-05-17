var Console = function(){
	var input;
	var displayResult = false;
	var result = null;
	var lastCommand = null;
	var commandMapping = {};
	var selectedEntity = null;

	function onKeyDown(e){
		if(displayResult){
			input.value = "";
			displayResult = false;
			return;
		}

		if(e.keyIdentifier == "Enter"){
			onEnterCommand(input.value);
			if(displayResult){
				input.value = result;
			}else{
				input.value = "";
			}
		}else if(e.keyIdentifier == "Up"){
			if(lastCommand != null && lastCommand.length > 0){
				input.value = lastCommand;
				displayResult = false;
			}
		}
	}

	function showError(error){
		alert(error);
	}

	function onEnterCommand(command){
		if(command.length == 0){
			return;
		}

		lastCommand = command;
		var params = command.split(" ");
		
		processCommand(params);
	}

	function getCommand(name){
		var commandClass = commandMapping[name];
		if(commandClass == null){
			throw name + " is not a valid command";
		}

		var command = new commandMapping[name]();

		return command;
	}

	function processCommand(params){
		var command = getCommand(params[0]);

		params.splice(0, 1);

		command.setActor(selectedEntity);
		command.setParams(params);
		var resultBack = command.execute();
		
		if(resultBack != null && resultBack.length > 0){
			result = resultBack;
			displayResult = true;
		}
	}

	return{
		setInput: function(value){
			input = value;
			input.addEventListener('keydown', function(e){
				onKeyDown(e);
			}, false);
		},

		setSelectedEntity: function(value){
			selectedEntity = value;
		},

		focus: function(){
			input.focus();
		},

		write: function(value){
			input.value = value;
			displayResult = true;
		},

		run: function(command){
			onEnterCommand(command);
		},

		runScenario: function(commands){
			commands.forEach(function(command){
				Console.run(command);
			});
		},

		setCommandMapping: function(value){
			commandMapping = value;
		},
	}
}();

module.exports = Console;