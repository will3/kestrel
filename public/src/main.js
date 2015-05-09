var container = $('#container');


Game.initialize(container);

Console.setCommands([		
			new AddCommand(),
			new AttackCommand(),
			new ListCommand(),
			new DestroyCommand(),
			new MoveCommand(),
			new OrbitCommand(),
			new SelectCommand(),
		]);

Console.setInput(document.getElementById('console_text'));

Console.run("add ship");
Console.run("cd ship0");
Console.run("move 100 100");