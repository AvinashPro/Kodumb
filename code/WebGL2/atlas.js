class Sprite {
  constructor(u0, v0, u1, v1) {
    this.u0 = u0;
    this.u1 = u1;
    this.v0 = v0;
    this.v1 = v1;
  }
}

class Spritesheet {
  
  constructor(img, x, y, w, h, columns, rows) {
    this.img = img;
    this.invWidth = 1 / img.width;
    this.invHeight = 1 / img.height;
    
    
    
    this.N_X = x / img.width;
    this.N_Y = y / img.height;
    
    
    this.columns = columns;
    this.rows = rows;
    this.invColumns = 1 / columns;

    this.N_spriteWidth = 1 / columns * (w / img.width);
    this.N_spriteHeight = 1 / rows * (h / img.height);
  }
  
  getSprite(idx, sprite = new Sprite()) {
    const N_X = (idx - 1) % this.columns * this.N_spriteWidth;
    const N_Y = Math.floor((idx - 1) * this.invColumns) * this.N_spriteHeight;
    sprite.u0 = N_X + this.N_X;
    sprite.v0 = 1 - (N_Y + this.N_Y);
    sprite.u1 = sprite.u0 + this.N_spriteWidth;
    sprite.v1 = sprite.v0 - this.N_spriteHeight;
    return sprite;
  }
  
}

class TextureAtlas {
  constructor(data, img) {
    this.data = data;
    this.img = img;
  }
  
  getSpritesheet(name) {
    if(!this.data[name]) throw new Error(`${name} spritsheet not found! Check the name`);
    
    
    const ss = this.data[name];
    const spritesheet = new Spritesheet(this.img, ss.x, ss.y, ss.w, ss.h, ss.columns, ss.rows);
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