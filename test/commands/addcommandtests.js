var AddCommand = require("../../app/commands/addcommand");
var expect = require("chai").expect;
var sinon = require("sinon");
var THREE = require("THREE");

describe("Add Command", function() {
    var addCommand = null;
    var game = null;
    var mockGame = null;

    beforeEach(function() {
        addCommand = new AddCommand();
        game = {
            addEntity: function() {},
            nameEntity: function() {},
        };
        mockGame = sinon.mock(game);
        addCommand.game = game;
        addCommand.objectMapping = {};
    })

    describe("execute", function() {
        it("should throw error when params empty", function() {
            addCommand.params = null;
            expect(function() {
                addCommand.execute();
            }).to.throw("must add something");
        })

        it("throws error if object mapping", function() {
            expect(function() {
                addCommand.params = ["test"];
                addCommand.execute();
            }).to.throw("cannot add test");
        })

        it("adds entity if has mapping", function() {
            addCommand.objectMapping = {
                "entity": require("../../app/entity")
            };
            addCommand.params = ["entity"];
            mockGame.expects("addEntity");

            addCommand.execute();

            mockGame.verify();
        })

        it("add entity if has mapping ignore case", function() {
            addCommand.objectMapping = {
                "entity": require("../../app/entity")
            };
            addCommand.params = ["ENTITY"];
            mockGame.expects("addEntity");

            addCommand.execute();

            mockGame.verify();
        })

        it("adds entity at location if provided", function() {
            addCommand.objectMapping = {
                "entity": require("../../app/entity")
            };
            addCommand.params = ["entity", 100, 100, 100];
            mockGame.expects("addEntity").withArgs(sinon.match.any, sinon.match(function(location) {
                return location.equals(new THREE.Vector3(100, 100, 100));
            }));

            addCommand.execute();

            mockGame.verify();
        })
    })
})