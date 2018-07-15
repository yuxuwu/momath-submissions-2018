/*
 * UTILITY
 */
var vector = {
	_x: 1,
	_y: 0,

	create: function(x, y) {
		var obj = Object.create(this);
		obj.setX(x);
		obj.setY(y);
		return obj;
	},

	setX: function(value) {
		this._x = value;
	},

	getX: function() {
		return this._x;
	},

	setY: function(value) {
		this._y = value;
	},

	getY: function() {
		return this._y;
	},

	setAngle: function(angle) {
		var length = this.getLength();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},

	getAngle: function() {
		return Math.atan2(this._y, this._x);
	},

	setLength: function(length) {
		var angle = this.getAngle();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},

	getLength: function() {
		return Math.sqrt(this._x * this._x + this._y * this._y);
	},

	add: function(v2) {
		return vector.create(this._x + v2.getX(), this._y + v2.getY());
	},

	subtract: function(v2) {
		return vector.create(this._x - v2.getX(), this._y - v2.getY());
	},

	multiply: function(val) {
		return vector.create(this._x * val, this._y * val);
	},

	divide: function(val) {
		return vector.create(this._x / val, this._y / val);
	},

	addTo: function(v2) {
		this._x += v2.getX();
		this._y += v2.getY();
	},

	subtractFrom: function(v2) {
		this._x -= v2.getX();
		this._y -= v2.getY();
	},

	multiplyBy: function(val) {
		this._x *= val;
		this._y *= val;
	},

	divideBy: function(val) {
		this._x /= val;
		this._y /= val;
  },

  dot: function(v2) {
    this._x *= v2.getX();
    this._y *= v2.getY();
  }
};


var particle = {
	position: null,
	velocity: null,
	mass: 1,
	radius: 0,
	bounce: -1,
  friction: 1,
  weight: 1,
  color: null,

	create: function(x, y, speed, direction, grav, weight, color) {
		var obj = Object.create(this);
		obj.position = vector.create(x, y);
		obj.velocity = vector.create(0, 0);
		obj.velocity.setLength(speed);
		obj.velocity.setAngle(direction);
    obj.gravity = vector.create(0, grav || 0);
    obj.weight = weight;
    obj.color = color;
		return obj;
	},

	accelerate: function(accel) {
		this.velocity.addTo(accel);
	},

	update: function() {
		this.velocity.multiplyBy(this.friction);
		this.velocity.addTo(this.gravity);
		this.position.addTo(this.velocity);
	},

	angleTo: function(p2) {
		return Math.atan2(p2.position.getY() - this.position.getY(), p2.position.getX() - this.position.getX());
	},

	distanceTo: function(p2) {
		var dx = p2.position.getX() - this.position.getX(),
			dy = p2.position.getY() - this.position.getY();

		return Math.sqrt(dx * dx + dy * dy);
	},

	gravitateTo: function(p2) {
		var grav = vector.create(0, 0),
			dist = this.distanceTo(p2);

		grav.setLength(p2.mass / (dist * dist));
		grav.setAngle(this.angleTo(p2));
		this.velocity.addTo(grav);
	}
};
var bungee = {
  start_x : null,
  start_y : null,
  end_x : null,
  end_y : null,
  angle : null,
  distance : null,

  create: function(start_x, start_y, end_x, end_y, distance) {
    var obj = Object.create(this);
    obj.start_x = start_x;
    obj.start_y = start_y;
    obj.end_x = end_x;
    obj.end_y = end_y;
    obj.angle = Math.atan2(end_y - start_y, end_x - start_x);
    obj.distance = distance;
    return obj;
  }
}
/*
 * UTILITY END
 */


import P5Behavior from "p5beh";
import * as Sensor from "sensors";

const pb = new P5Behavior();

const GRAVITY = 0.5;
const INIT_VELOCITY = 23;
const TARGET_Y = 288;
const TARGET_X = 500;
const TARGET_RADIUS = 20;

var targetImage;
var score = 0;

var cannon = {
  x: 100,
  y: 576,
  angle: -Math.PI/2.25
};
var Balls = [];
var Bungees = [];
var time;
var ball_num = 0;

pb.preload = function (p) {
  targetImage = this.loadImage('images/target.png')
};

pb.setup = function (p) {
  time = this.millis();
};

var ballTypes = {
  0 : {
    weight: 6,
    radius: 20,
    color: "#EFD5C3"
  },
  1 : {
    weight: 8,
    radius: 25,
    color: "#FFD4CA"
  },
  2 : {
    weight: 10,
    radius: 30,
    color: "#AAC0AF"
  },
  3 : {
    weight: 12,
    radius: 35,
    color: "#839791"
  },
  4 : {
    weight: 14,
    radius: 40,
    color: "#896978"
  }
};

/*
 * HELPER FUNCTIONS
 */
/// Shoots a ball from the cannon's position and angle
function shoot() {
  let ball = particle.create(
    cannon.x + Math.cos(cannon.angle), 
    cannon.y + Math.sin(cannon.angle), 
    (INIT_VELOCITY*6+(ball_num*4))/(ballTypes[ball_num].weight),
    cannon.angle, 
    GRAVITY,
    6,
    ballTypes[ball_num].color,
    ballTypes[ball_num].weight,
  );
  //console.log(ballTypes[ball_num].color);
  //ball.radius = ballTypes[ball_num].radius;
  ball.radius = ballTypes[ball_num].radius;
  ball.velocity.setAngle(cannon.angle);
  Balls.push(ball);
  ball_num++;
  if(ball_num>4) ball_num = 0;
}
function createBungee(start_x, start_y, end_x, end_y, distance) {
  Bungees.push(bungee.create(start_x, start_y, end_x, end_y, distance));
}
function dist(x1, y1, x2, y2) {
  var a = x1 - x2;
  var b = y1 - y2;

  return Math.sqrt( a*a + b*b );
}


// LINE/CIRCLE
function lineCircle(x1, y1, x2, y2, cx, cy, r) {

  // is either end INSIDE the circle?
  // if so, return true immediately
  let inside1 = pointCircle(x1,y1, cx,cy,r);
  let inside2 = pointCircle(x2,y2, cx,cy,r);
  if (inside1 || inside2) return true;

  // get length of the line
  let distX = x1 - x2;
  let distY = y1 - y2;
  let len = Math.sqrt( (distX*distX) + (distY*distY) );

  // get dot product of the line and circle
  let dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / Math.pow(len,2);

  // find the closest point on the line
  let closestX = x1 + (dot * (x2-x1));
  let closestY = y1 + (dot * (y2-y1));

  // is this point actually on the line segment?
  // if so keep going, but if not, return false
  let onSegment = linePoint(x1,y1,x2,y2, closestX,closestY);
  if (!onSegment) return false;

  // get distance to closest point
  distX = closestX - cx;
  distY = closestY - cy;
  let distance = Math.sqrt( (distX*distX) + (distY*distY) );

  if (distance <= r) {
    return true;
  }
  return false;
}


// POINT/CIRCLE
function pointCircle(px, py, cx, cy, r) {

  // get distance between the point and circle's center
  // using the Pythagorean Theorem
  let distX = px - cx;
  let distY = py - cy;
  let distance = Math.sqrt( (distX*distX) + (distY*distY) );

  // if the distance is less than the circle's
  // radius the point is inside!
  if (distance <= r) {
    return true;
  }
  return false;
}


// LINE/POINT
function linePoint(x1,y1, x2, y2, px, py) {

  // get distance from the point to the two ends of the line
  let d1 = dist(px,py, x1,y1);
  let d2 = dist(px,py, x2,y2);

  // get the length of the line
  let lineLen = dist(x1,y1, x2,y2);

  // since floats are so minutely accurate, add
  // a little buffer zone that will give collision
  let buffer = 0.1;    // higher # = less accurate

  // if the two distances are equal to the line's
  // length, the point is on the line!
  // note we use the buffer here to give a range,
  // rather than one #
  if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
    return true;
  }
  return false;
}
/*
 * HELPER FUNCTIONS END
 */

pb.draw = function (floor, p) {
  this.background(51);

  /// Draw Score
  this.push();
    //this.noStroke();
    this.fill("#fff");
    this.textSize(50+score/5);
    this.textAlign(this.CENTER, this.CENTER);
    if(score < 10)
      this.text("0"+score.toString(), 576/2, 576/2-50);
    else
      this.text(score.toString(), 576, 576);
  this.pop();
  /// Draw target
  this.image(targetImage, TARGET_X - TARGET_RADIUS, TARGET_Y - TARGET_RADIUS, TARGET_RADIUS * 2, TARGET_RADIUS * 2, 0, 0);

  /// Generate bungees
  let taken_ids = new Set([]);
  if (floor.users.length >= 2) {
    for(let i = 0; i < floor.users.length; i++) {
    //pb.drawUser(floor.users[i]);
      let current_id = floor.users[i].id;
      if(!taken_ids.has(current_id)) {
        // Find 1st nearest neighbor
        let closest_distance = Infinity;
        let closest_distance_id = null;
        let closest_index = null;
        for(let j = i+1; j < floor.users.length; j++) {
          // Check if user has already been taken
          if (!taken_ids.has(floor.users[j].id)) {
            let distance = Math.pow(floor.users[j].x - floor.users[i].x, 2) + Math.pow(floor.users[j].y - floor.users[i].y, 2);
            if (distance < closest_distance) {
              closest_distance = distance;
              closest_distance_id = floor.users[j].id;
              closest_index = j;
            }
          }
        }
        // Create bungee between two points
        if(closest_distance != Infinity
          //&& closest_distance < 240
        ) {
          createBungee(floor.users[i].x, floor.users[i].y, floor.users[closest_index].x, floor.users[closest_index].y, closest_distance);
          taken_ids.add(current_id);
          taken_ids.add(closest_distance_id);
        }
      }
    }
  }

  /// Draw bungees
  this.push();
    this.strokeWeight(8);
    this.stroke("#fff");
    for (let i = 0; i < Bungees.length; i++) {
      //console.log(Bungees[i].start_x + " " + Bungees[i].start_y + " " + Bungees[i].end_x + " " + Bungees[i].end_y);
      this.line(
        Bungees[i].start_x, Bungees[i].start_y, 
        Bungees[i].end_x, Bungees[i].end_y
      );
    }
  this.pop();


  /// Determine if a ball should be shot
  if (this.millis() > time + 1000) {
    shoot();
    time = this.millis();
  }

  /// Update Balls
  let i = Balls.length;
  while(i--){

    // Project a ball forward
    var temp_ball = Balls[i];
    temp_ball.update();
    //check if target collided based on circular distance check, reset target and grow tail if so
    if (dist(temp_ball.position.getX(), temp_ball.position.getY(), TARGET_X, TARGET_Y) < temp_ball.radius + TARGET_RADIUS){
      //console.log("target hit");
      switch(temp_ball.weight) {
        case 6:
          score += 1;
          break;
        case 10:
          score += 5;
          break;
        case 12:
          score += 10;
          break;
        case 16:
          score += 50;
          break;
        case 18:
          score += 100;

      }
      Balls.splice(i, 1);
    }
    /// Collision detection against bungee
    for(let j = 0; j < Bungees.length; j++) {
     /// If ball collided with line
      if(lineCircle(Bungees[j].start_x, Bungees[j].start_y, Bungees[j].end_x, Bungees[j].end_y, temp_ball.position.getX(), temp_ball.position.getY(), temp_ball.radius)) {

        let magnitude = (INIT_VELOCITY*2.5/Balls[i].weight);
        //let angle = this.PI - (this.PI/2 + Bungees[j].angle);

        // Get new velocity vector
        // Get normal of wall
        let wall_normal = vector.create((Bungees[j].end_x - Bungees[j].start_x)/Bungees[j].distance, (Bungees[j].end_y - Bungees[j].start_y)/Bungees[j].distance);
        console.log(wall_normal);
        wall_normal.dot(Balls[i].velocity);
        let new_velocity = wall_normal;
        console.log(new_velocity);
        new_velocity.multiply(2);
        new_velocity.dot(wall_normal);
        new_velocity.subtractFrom(Balls[i].velocity);
        new_velocity.multiply(-1);


        Balls[i].velocity = new_velocity;
        Balls[i].velocity.setLength(magnitude);
      }
    }
    /// Update Ball Positions
    Balls[i].update();
    /// Draw Ball
    this.push();
      this.noStroke();
      this.fill(Balls[i].color);
      this.arc(
        Balls[i].position.getX(),
        Balls[i].position.getY(),
        Balls[i].radius*2,
        Balls[i].radius*2,
        0, this.PI * 2
      );
    this.pop();

  }
  /// Delete ball if out of bounds
  i = Balls.length;
  while(i--){
    if(Balls[i].position.getX() > 576 || Balls[i].position.getY() > 576) {
      Balls.splice(i,1);
    }
 
  }
  /// Destroy all bungees to reset
  Bungees.splice(0, Bungees.length);
  /// Draw Cannon
  this.push();
    this.translate(cannon.x, cannon.y);
    this.rotate(cannon.angle);
    this.rect(0, -8, 40, 16);
  this.pop();
  this.arc(cannon.x, cannon.y, 40, 40, this.PI, 0);


};

export const behavior = {
  title: "Ballistics",
  init: pb.init.bind(pb),
  frameRate: 30,
  render: pb.render.bind(pb),
};
export default behavior
