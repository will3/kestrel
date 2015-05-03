var container = $('#container');


Game.initialize(container);

Console.setCommands([		
			new AddCommand(),
			new AttackCommand(),
			new ListCommand(),
			new DestroyCommand(),
			new MoveCommand(),
		]);

Console.setInput(document.getElementById('console_text'));

Console.run("add ship");
Console.run("move ship0 100 100");