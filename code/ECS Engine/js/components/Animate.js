import Component from "../ecs/Component.js"

export default class Animate extends Component {
  constructor({states = {}, time = 300}) {
    super();
    this.states = states;
    this.time = time;
    this.currentFrame = null;
    this.currentFrameIdx = 0;
    this.currentState = "idle";
    this.elapsedTime = 0;
  }
  
}