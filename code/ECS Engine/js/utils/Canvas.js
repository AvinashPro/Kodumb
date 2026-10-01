export default function createCanvas(w, h) {
  const dpr = window.devicePixelRatio || 1;
  const canvas = document.createElement("canvas");
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  
  return canvas;
  
}