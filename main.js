async function fetchJSON(url) {
  const res = await fetch(url);
  if(!res.ok) throw new Error(`Failed to fetch JSON ${url}`);
  const json = await res.json();
  return json;
}

const codeData = await fetchJSON("./code.json");
const currentUrl = window.location.href;
const ghProfileName = currentUrl.split(".")[0].split("/")[2];
const ghProfileUrl = `https://github.com/${ghProfileName}`;
const repoName = currentUrl.split("/")[3];


let html = "";
for(const entry of codeData.code) {
  const { name, src } = entry;
  
  html += `
    <div class="code-card">
      <div class="code-name">${name}</div>
      <a href="${ghProfileUrl}/${repoName}/tree/main/code/${name}">code</a>
  `;
  if(src instanceof Array) {
    html += `<a href="${src[0]}">page</a>`;
    html += (src.length > 12 ? "<br>" : "") + `<a href="${src[0]}">1</a>`;
    for(let i = 1; i < src.length; i++) {
      html += `<a href="${src[i]}">${i+1}</a>`;
    }
  } else {
    html += `<a href="${src}">page</a>`;
  }
  
  html += `</div>`;
  
}

const codeSectionElm = document.querySelector("#code-section");
codeSectionElm.innerHTML = html;
const codeCardElms = codeSectionElm.querySelectorAll(".code-card");

const searchBar = document.querySelector("#search-bar");
searchBar.addEventListener("input", () => {
  const q = searchBar.value.toLowerCase();
  for(const codeCardElm of codeCardElms) {
    if(codeCardElm.querySelector(".code-name").textContent.toLowerCase().includes(q)) {
      codeCardElm.style.display = "block";
    } else {
      codeCardElm.style.display = "none";
    }
  }
  console.log(q);
})

