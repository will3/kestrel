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

    describe("start", function() {
        it("should throw error when params empty", function() {
            addCommand.params = null;
            expect(function() {
                addCommand.start();
            }).to.throw("must add something");
        })

        it("throws error if object mapping", function() {
            expect(function() {
                addCommand.params = ["test"];
                addCommand.start();
            }).to.throw("cannot add test");
        })

        it("adds entity if has mapping", function() {
            addCommand.objectMapping = {
                "entity": function() {
                    return {};
                }
            };
            addCommand.params = ["entity"];
            mockGame.expects("addEntity");

            addCommand.start();

            mockGame.verify();
        })

        it("adds entity at location if provided", function() {
            var entity = {};
            addCommand.objectMapping = {
                "entity": function() {
                    return entity;
                }
            };
            addCommand.params = ["entity", 100, 100, 100];
            mockGame.expects("addEntity");

            addCommand.start();

            expect(entity.position.equals(new THREE.Vector3(100, 100, 100)));
            mockGame.verify();
        })
    })
})