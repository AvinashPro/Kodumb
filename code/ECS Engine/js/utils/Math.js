export default const math = {
  
  rand: function(min, max) {
    return Math.random() * (max - min) + max;
  },
  randint: function(min, max) {
    return Math.round(this.rand(min, max));
  }
  
}