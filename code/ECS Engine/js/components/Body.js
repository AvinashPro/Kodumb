import Component from "../ecs/Component.js"
import Vector from "../utils/Vector.js"

export default class Body extends Component {
  constructor({vel = new Vector(0, 0), mass = 1, isStatic = false, restitution = 1, friction = 0.1, gravityScale = 0, type = "Kinematic", jumpForce = 0}) {
    super();
    this.mass = mass;
    this.invMass = (mass === 0) ? Infinity : 1 / mass;
    this.vel = vel;
    this.isStatic = isStatic;
    this.restitution = restitution;
    this.friction = friction;
    this.type = type;
    
    this.jumpForce = jumpForce;
    // Kinematic - Platformer player, Top-down player
    // Dynamic - Boxes, Crates
    // Static - Wall, Ground
    
    this.force = new Vector();
    this.gravityScale = gravityScale;
    this.acceleration = new Vector();
    
  }
  
  
}