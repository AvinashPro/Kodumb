export default function createController(data, elm_id) {
  let html = "";
  data.forEach(d => {
    const {name, id, _class} = d;
    html += `<div class="${_class}" id="${id}">${name}</div>`
  })
  const result = document.createElement("div");
  result.innerHTML = html;
  result.id = elm_id;
  return result;
}