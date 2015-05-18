var AddCommand = require("../../app/commands/AddCommand");
var expect = require("chai").expect;
var sinon = require("sinon");
var THREE = require("THREE");

describe("Add Command", function(){
	var addCommand = null;
	var game = null;
	var mockGame = null;
	
	beforeEach(function(){
		addCommand = new AddCommand();
		game = {
			addEntity: function(){},
			nameEntity: function(){},
		};
		mockGame = sinon.mock(game);
		addCommand.setGame(game);
	})

	describe("execute", function(){
		it("should throw error when params empty", function(){
			addCommand.setParams(null);
			expect(function(){
				addCommand.execute();
			}).to.throw("must add something");
		})

		it("throws error if object mapping", function(){
			addCommand.setObjectMapping(null);
			expect(function(){
				addCommand.setParams(["test"]);
				addCommand.execute();
			}).to.throw("cannot add test");
		})

		it("adds entity if has mapping", function(){
			addCommand.setObjectMapping({"entity": require("../../app/entity")});
			addCommand.setParams(["entity"]);
			mockGame.expects("addEntity");

			addCommand.execute();

			mockGame.verify();
		})

		it("add entity if has mapping ignore case", function(){
			addCommand.setObjectMapping({"entity": require("../../app/entity")});
			addCommand.setParams(["ENTITY"]);
			mockGame.expects("addEntity");

			addCommand.execute();

			mockGame.verify();
		})

		it("adds entity at location if provided", function(){
			addCommand.setObjectMapping({"entity": require("../../app/entity")});
			addCommand.setParams(["entity", 100, 100, 100]);
			mockGame.expects("addEntity").withArgs(sinon.match.any, sinon.match(function(location){
				return location.equals(new THREE.Vector3(100, 100, 100));
			}));

			addCommand.execute();

			mockGame.verify();
		})
	})
})
