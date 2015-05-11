var container = $('#container');

Game.initialize(container);

Console.setInput(document.getElementById('console_text'));

Console.run("add ship");
Console.run("select ship0");
Console.run("orbit 0 0 0 300");

Console.run("add ship");
Console.run("select ship1");
Console.run("orbit 0 0 0 200");

Console.run("add ship");
Console.run("select ship2");
Console.run("orbit 0 0 0 100");

