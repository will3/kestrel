var _ = require("lodash");

var EntityRunner = function() {
    this.entities = [];

}

EntityRunner.prototype = {
    constructor: EntityRunner,

    runEntity: function(entity) {
        if (entity.life != -1) {
            if (entity.frameAge == entity.life) {
                entity.removeFromParent();
            }
        }

        if (!entity.started) {
            entity.start();
            entity.started = true;
        }
        entity.update();

        entity.components.forEach(function(component) {
            if (!component.started) {
                component.start();
                component.started = true;
            }
            component.update();
        });

        entity.childEntities.forEach(function(childEntity) {
            this.runEntity(childEntity);
        }.bind(this));

        //increment frame age
        entity.frameAge += 1;
    },

    addEntity: function(entity) {
        this.entities.push(entity);
    },

    removeEntity: function(entity) {
        entity.childEntities.forEach(function(childEntity) {
            this.removeEntity(childEntity);
        }.bind(this));

        _.remove(this.entities, entity);
        entity.components.forEach(function(c) {
            c.destroy();
        });
        entity.destroy();
    },

    run: function() {
        this.entities.forEach(function(entity) {
            this.runEntity(entity);
        }.bind(this));
    },

    getEntityCount: function() {
        return this.entities.length;
    }
}

module.exports = EntityRunner;
