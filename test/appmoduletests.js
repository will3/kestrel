var injector = require("../app/injector");
var expect = require("chai").expect;
var sinon = require("sinon");

describe("AppModule", function(){
	var input;
	beforeEach(function(){
		input = {};
		document = { };
		document.getElementById = sinon.stub().returns(input).withArgs('console_text');
		var AppModule = require("../app/appmodule");
		var appModule = new AppModule();
		injector.loadModule(appModule);
	})

	it("should inject game correctly", function(){
		var game = injector.get("game");
		expect(game).to.exist;
		expect(game.entityRunner).to.exist;
		expect(game.collision).to.exist;
	});

	it("should inject game as singleton", function(){
		var game1 = injector.get("game");
		var game2 = injector.get("game");
		expect(game1).to.equal(game2);
	});

	it("should inject ship correctly", function(){
		var ship = injector.get("ship");
		expect(ship).to.exist;
		expect(ship.shipController).to.exist;
		expect(ship.rigidBody).to.exist;
		expect(ship.weaponController).to.exist;
		expect(ship.weapons).to.exist;
		expect(ship.smokeTrail).to.exist;
		expect(ship.renderComponent).to.exist;
	});

	it("should inject addCommand correctly", function(){
		var addCommand = injector.get("addCommand");
		expect(addCommand).to.exist;
		expect(addCommand.game).to.exist;
		expect(addCommand.objectMapping).to.exist;
	});

	it("should inject console correctly", function(){
		var console = injector.get("console");
		expect(console).to.exist;
		expect(console.commandMapping).to.exist;
		expect(console.input).to.exist;
	});

	it("should inject console as singleton", function(){
		var console1 = injector.get("console");
		var console2 = injector.get("console");
		expect(console1).to.equal(console2);
	});

	it("should inject laser correctly", function(){
		var laser = injector.get("laser");
		expect(laser).to.exist;
		expect(laser.rigidBody).to.exist;
		expect(laser.rigidBody.defaultFriction).to.equal(1);
	});
})