class Sprite {
  constructor(u0, v0, u1, v1) {
    this.u0 = u0;
    this.u1 = u1;
    this.v0 = v0;
    this.v1 = v1;
  }
}

class Spritesheet {
  
  constructor(atlasInvWidth, atlasInvHeight, x, y, w, h, columns, rows) {
    this.columns = columns;
    this.rows = rows;
    this.invColumns = 1 / columns;
    
    this.u = x * atlasInvWidth;
    this.v = y * atlasInvHeight;
    this.du = (1 / columns) * w * atlasInvWidth;
    this.dv = (1 / rows) * h * atlasInvHeight;
  }
  
  getSprite(idx, sprite = new Sprite()) {
    const u = (idx - 1) % this.columns * this.du;
    const v = Math.floor((idx - 1) * this.invColumns) * this.dv;
    sprite.u0 = u + this.u;
    sprite.v0 = 1 - (v + this.v);
    sprite.u1 = sprite.u0 + this.du;
    sprite.v1 = sprite.v0 - this.dv;
    return sprite;
  }
  
}

class TextureAtlas {
  constructor(data, img) {
    this.data = data;
    this.img = img;
    this.invWidth = 1 / img.width;
    this.invHeight = 1 / img.height;
  }
  
  getSpritesheet(name) {
    if(!(name in this.data)) throw new Error(`${name} spritesheet not found! Check the name!`);
    
    const ss = this.data[name];
    const spritesheet = new Spritesheet(this.invWidth, this.invHeight, ss.x, ss.y, ss.w, ss.h, ss.columns, ss.rows);
    return spritesheet;
  }
  
  
}


const atlasData = {
  player: {
    x: 0, y: 0, w: 128, h: 128, columns: 8, rows: 8
  },
  enemy: {
    x: 128, y: 0, w: 64, h: 48, columns: 4, rows: 3
  },
  props: {
    x: 128, y: 48, w: 64, h: 80, columns: 2, rows: 4
  }
};

// dummy data
const atlas = new TextureAtlas(atlasData, {
  width: 192, height: 128
});
const playerSpritesheet = atlas.getSpritesheet("player");
const playerCurrentSprite = playerSpritesheet.getSprite(1);
playerSpritesheet.getSprite(10, playerCurrentSprite);


console.log("Atlas", atlas);
console.log("Player Spritesheet", playerSpritesheet);
console.log("Player current sprite", playerCurrentSprite);