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
            getEntities: function() {
                return [];
            }
        };
        orbitCommand.game = game;
    })

    describe("execute", function() {
        it("parses target correctly", function() {
            orbitCommand.params = [1, 2, 3];
            orbitCommand.execute();
            expect(orbitCommand.target.position.equals(new THREE.Vector3(1, 2, 3))).to.be.true;
        })

        it("parses distance correctly", function() {
            orbitCommand.params = [1, 2, 3, 50];
            orbitCommand.execute();
            expect(orbitCommand.distance).to.equal(50);
        })

        it("issues command to ship", function() {
            var mockShipController = sinon.mock(shipController);
            actor.shipController = shipController;
            // cannot match orbit command as arg
            // mockShipController.expects("setCommand").withArgs(orbitCommand);
            mockShipController.expects("setCommand");

            orbitCommand.execute();

            mockShipController.verify();
        })
    })
})