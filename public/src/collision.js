var Collision = Entity.extend(function(){
	this.elasticity = 0.5;
	this.friction = 0.5;
}).methods({
	start: function(){

	},

	update: function(){
		var entities = _.filter(Game.getEntities(), function(entity){ return entity.hasCollision == true; });
		for(var i = 0; i < entities.length; i++){
			for(var j = 0; j < i; j ++){
				if(i == j){
					continue;
				}

				var a = entities[i];
				var b = entities[j];

				if(a.collisionRadius == null || b.collisionRadius == null){
					continue;
				}

				var distanceVector = new THREE.Vector3();
				distanceVector.subVectors(b.getPosition(), a.getPosition());
				var distance = distanceVector.length();
				if(distance == 0){
					distanceVector = new THREE.Vector3(Math.random(), Math.random(), Math.random());
					distanceVector.setLength(1);
					distance = 1;
				}

				var collisionDistance = a.collisionRadius + b.collisionRadius;
				if(distance < collisionDistance){
					//notify collision
					if(a.onCollision != null){
						a.onCollision(b);
					}

					if(b.onCollision != null){
						b.onCollision(a);
					}					

					// if(a.rigidBody != null && b.rigidBody != null){
					// 	//elasticity
					// 	var radio = (collisionDistance - distance) / collisionDistance;
					// 	var force = new THREE.Vector3();
					// 	force.copy(distanceVector);
					// 	force.setLength(this.elasticity);
					// 	b.rigidBody.applyForce(force);
					// 	b.rigidBody.applyFriction(this.friction);
					// }
				}
			}
		}
	}
});