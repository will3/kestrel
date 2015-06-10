var Ammo = require("../../app/entities/ammo");
var CollisionBody = require("../../app/components/collisionbody");
var expect = require("chai").expect;

describe("Ammo", function(){
	it("should have collision body", function(){
		var ammo = new Ammo();
		expect(ammo.getComponent(CollisionBody)).to.exist;
	});
});