import Vector from "../utils/Vector.js"
import Component from "../ecs/Component.js"

export default class Position extends Component {
  constructor(x = 0, y = 0) {
    super();
    this.pos = new Vector(x, y);
  }
}