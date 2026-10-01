import Vector from "../utils/Vector.js"
import Component from "../ecs/Component.js"

export default class Velocity extends Component {
  constructor(x = 0, y = 0) {
    super();
    this.vel = new Vector(x, y);
  }
}