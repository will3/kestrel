var container = $('#container');

Game.initialize(container);

Console.setInput(document.getElementById('console_text'));

Console.run("add ship");
Console.run("add ship 100 0 100");

Console.run("select ship1");
Console.run("orbit 0 0 0 100");
Console.run("select ship0");
Console.run("attack ship1");