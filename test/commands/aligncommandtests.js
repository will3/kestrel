var AlignCommand = require("../../app/commands/aligncommand");
var expect = require("chai").expect;
var THREE = require("THREE");
var sinon = require("sinon");

describe("Align Command", function() {
    var alignCommand, actor, shipController, mockShipController;

    beforeEach(function() {
        alignCommand = new AlignCommand();
        actor = {};
        alignCommand.actor = actor;
        shipController = {
            setCommand: function() {},
            align: function() {}
        };
        actor.shipController = shipController;
        mockShipController = sinon.mock(shipController);
    })

    describe("execute", function() {
        it("should parse target correctly", function() {
            alignCommand.params = ["100", "100", "100"];
            alignCommand.execute();
            expect(alignCommand.target.equals(new THREE.Vector3(100, 100, 100))).to.equal(true);
        })

        it("should issue command", function() {
            alignCommand.params = ["100", "100", "100"];
            alignCommand.execute();
            mockShipController.expects("setCommand").withArgs(alignCommand);

            alignCommand.execute();

            mockShipController.verify();
        })
    })

    describe("on update", function() {
        it("should align", function() {
            alignCommand.params = ["100", "100", "100"];
            alignCommand.execute();
            mockShipController.expects("align").withArgs(matchingVector(100, 100, 100));

            alignCommand.update();

            mockShipController.verify();
        })
    })

    function matchingVector(x, y, z) {
        return sinon.match(function(target) {
            return target.equals(new THREE.Vector3(x, y, z));
        });
    }
})