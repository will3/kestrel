var Console = (function(){
	var input;
	var displayResult = false;
	var result = null;
	var lastCommand = null;
	var commands = [];

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
		try{
			processCommand(params);
		}catch(error){
			showError(error);
		}
	}

	function getMatchingCommand(name){
		return $.grep(commands, function(c){ 
			var op = c.getOp();
			if($.isArray(op)){
				for(var i = 0; i < op.length; i++){
					if(op[i] == name){
						return true;
					}
				}
				return false;
			}

			return c.getOp() == name; 
		})[0];
	}

	function processCommand(params){
		var firstParam = params[0];
		var commandIndex = 0;
		var command = getMatchingCommand(params[0]);
		if(command == null){
			command = getMatchingCommand(params[1]);
			commandIndex = 1;

			if(command == null){
				throw params + " is not a valid command or entity name";
			}
		}

		params.splice(commandIndex, 1);
		command.params = params;
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

		focus: function(){
			input.focus();
		},

		write: function(value){
			input.value = value;
			displayResult = true;
		},

		setCommands: function(value){
			commands = value;
		}
	}
})();