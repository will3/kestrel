var Control = require("../app/control");
var sinon = require("sinon");
var expect = require("chai").expect;

describe("Control", function() {
    var control, keyMap, container;

    beforeEach(function() {
        control = new Control();
        keyMap = {};
        control.keyMap = keyMap;
        container = {};
    });

    describe("#mousemove", function() {
        it("should set up handler", function() {
            var handler = sinon.stub();
            control.mouseMove(handler);
            expect(control.mouseMoveHandler).to.equal(handler);
        })
    });

    describe("#hookContainer", function() {
    	it("should set up mouse events on container", function(){
    		control.hookContainer(container);

    		expect(container.onmousedown).to.exist;
    		expect(container.onmouseup).to.exist;
    		expect(container.onmouseleave).to.exist;
    		expect(container.onmousemove).to.exist;
    	})
    });

    describe("mosue events", function(){
    	it("should set drag flag to true when mouse down", function(){

    	})

    	it("should set drag flag to false when mouse up", function(){

    	})

    	it("should set drag flag to false when mouse leave", function(){

    	})

    	it("should notify drag when mouse move and is dragging", function(){

    	})

    	it("should not notify drag when mouse move and not dragging", function(){
    		
    	})
    })
});