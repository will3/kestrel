var container = $('#container');

Game.initialize(container);

Console.loadCommands([		
			new AddCommand(),
			new AttackCommand(),
			new ListCommand(),
			new DestroyCommand(),
			new MoveCommand(),
			new OrbitCommand(),
			new SelectCommand(),
			new AlignCommand(),
		]);

Console.setInput(document.getElementById('console_text'));

Console.run("add ship");
Console.run("cd ship0");
Console.run("orbit 0 0");