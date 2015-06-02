var BlockUtils = require("../../app/blockengine/blockutils");
var expect = require("chai").expect;

describe("BlockUtils", function() {
    describe("#visitRange", function() {
        it("should visit blocks in radius 0", function() {
            var count = 0;
            BlockUtils.visitRange(0, 0, 0, 0, function(x, y, z) {
                count++;
            });
            expect(count).to.equal(1);
        });

        it("should visit blocks in radius 1", function() {
            var count = 0;
            BlockUtils.visitRange(0, 0, 0, 1, function(x, y, z, distance) {
                count++;
            });
            expect(count).to.equal(1 + 6);
        });

        it("should visit blocks in radius 2", function(){
        	var count = 0;
        	BlockUtils.visitRange(0,0,0,2,function(x,y,z,distance){
        		count ++ ;
        	});
        	expect(count).to.equal(1 + 6 + 18);
        });

        it("should offset values by center", function(){
        	var actualX = null;
        	var actualY = null;
        	var actualZ = null;
        	BlockUtils.visitRange(99,99,99,0, function(x, y, z, distance){
        		actualX = x;
        		actualY = y;
        		actualZ = z;
        	});
        	expect(actualX).to.equal(99);
        	expect(actualY).to.equal(99);
        	expect(actualZ).to.equal(99);
        });
    });
});