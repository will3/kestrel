var container = $('#container');

Game.initialize(container);

Console.setInput(document.getElementById('console_text'));

Console.run("add ship");
Console.run("select ship0");
Console.run("orbit 100 100 100");