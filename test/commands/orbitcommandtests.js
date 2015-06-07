var OrbitCommand = require("../../app/commands/orbitcommand");
var THREE = require("THREE");
var expect = require("chai").expect;
var sinon = require("sinon");

describe("OribtCommand", function() {
    var orbitCommand, actor, game, shipController;

    beforeEach(function() {
        orbitCommand = new OrbitCommand();
        shipController = {
            setCommand: function() {}
        };
        actor = {
            shipController: shipController
        };
        orbitCommand.actor = actor;
        game = {
            getEntityNamed:function(){
                return {};
            }
        };
        orbitCommand.game = game;
    })

    describe("start", function() {
        it("parses distance correctly", function() {
            orbitCommand.params = ["entity", 50];
            orbitCommand.start();
            expect(orbitCommand.distance).to.equal(50);
        });
    })
})