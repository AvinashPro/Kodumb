export function compileShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Failed to compile ${type === gl.VERTEX_SHADER ? "vertex": "fragment"} shader! Info Log: ${log}`);
  }

  return shader;
}

export function compileProgram(gl, vs_src, fs_src) {
  const program = gl.createProgram();
  const vs = compileShader(gl, gl.VERTEX_SHADER, vs_src);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fs_src);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.deleteProgram(program);
    throw new Error(`Failed to link program! Info Log: ${log}`);
  }

  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}