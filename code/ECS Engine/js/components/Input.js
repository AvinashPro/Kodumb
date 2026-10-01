import Component from "../ecs/Component.js"

export default class Input extends Component {
  constructor(states) {
    super();
    this.states = states;
  }
  isDown(stateName) {
    const state = this.states[stateName];
    if(!state) return;
    return state.isDown;
  }
}