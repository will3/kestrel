describe('Console', function(){
	var console = null;

	beforeEach(function(){
		console = new Kestrel.Console();
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
			expect(function(){console.run("invalid_command");}).to.throw("invalid_command is not a valid command or entity name");
		});

		it('should not throw for list', function(){
			console.loadCommands([
				new ListCommand(),
				]);
			console.run("list");
		});
	});

	function mockInput(){
		var input = document.createElement("input");
		input.type = "text";
		return sinon.mock(input);
	}
});

// 		setCommands: function(value){
// 			commands = value;
// 		},

// 		run: function(command){
// 			onEnterCommand(command);
// 		}
// 	}
// })();

// var Console = (function(){
// 	var input;
// 	var displayResult = false;
// 	var result = null;
// 	var lastCommand = null;
// 	var commands = [];
// 	var selectedEntity = null;

// 	function onKeyDown(e){
// 		if(displayResult){
// 			input.value = "";
// 			displayResult = false;
// 			return;
// 		}

// 		if(e.keyIdentifier == "Enter"){
// 			onEnterCommand(input.value);
// 			if(displayResult){
// 				input.value = result;
// 			}else{
// 				input.value = "";
// 			}
// 		}else if(e.keyIdentifier == "Up"){
// 			if(lastCommand != null && lastCommand.length > 0){
// 				input.value = lastCommand;
// 				displayResult = false;
// 			}
// 		}
// 	}

// 	function showError(error){
// 		alert(error);
// 	}

// 	function onEnterCommand(command){
// 		if(command.length == 0){
// 			return;
// 		}

// 		lastCommand = command;
// 		var params = command.split(" ");
		
// 		processCommand(params);
// 	}

// 	function getMatchingCommand(name){
// 		return $.grep(commands, function(c){ 
// 			var op = c.getOp();
// 			if($.isArray(op)){
// 				for(var i = 0; i < op.length; i++){
// 					if(op[i] == name){
// 						return true;
// 					}
// 				}
// 				return false;
// 			}

// 			return c.getOp() == name; 
// 		})[0];
// 	}

// 	function processCommand(params){
// 		var command = getMatchingCommand(params[0]);
// 		if(command == null){
// 			throw params + " is not a valid command or entity name";
// 		}

// 		params.splice(0, 1);

// 		command.actor = selectedEntity;
// 		command.params = params;
// 		var resultBack = command.execute();
		
// 		if(resultBack != null && resultBack.length > 0){
// 			result = resultBack;
// 			displayResult = true;
// 		}
// 	}
