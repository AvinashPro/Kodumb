fetch("data.json").then(response => {
  return response.json();
}).then(data => {
  init(data);
}).catch(error => {
  console.log(error)
})


const vocabElm = document.getElementById("vocab");


function wordToFuriganaHtml(word) {
  let html = '<div class="word">';
  word.split("/").forEach(w => {
    let k = w.split("_");
    if(k.length == 1) {
      html += `<span>${k[0]}</span>`
    } else {
      html += `<span class="kanji">${k[0]}<div class="furigana">${k[1]}</div></span>`;
    }
  })
  html += "</div>";
  
  return html;
}


function handleVocab(type, data) {
  let typeHTML = `
  <h4 class="sub-heading">${type}</h4>
  `;
  data.vocab[type].forEach((wordArr, idx) => {
    typeHTML += `<div class="word-idx">${idx+1}</div>`;
    typeHTML += wordToFuriganaHtml(wordArr[0]);
    typeHTML += `<div class="meaning">${wordArr[1]}</div>`;
    
    typeHTML += `<div class="sentences">`;
    let sentences = wordArr[2] || [];
    sentences.forEach(sentence => {
      typeHTML += wordToFuriganaHtml(sentence[0]);
      typeHTML += `<div class="translation">${sentence[1]}</div>`;
    })
    typeHTML += `</div>`;
    
    let desc = wordArr[3];
    if(desc) {
      typeHTML += `<div class="word-desc">${desc}</div>`;
    }
    
    if(idx + 1 != data.vocab[type].length) {
      typeHTML += '<div class="rule"></div>';
    }
  })

  
  const section = document.createElement("section");
  section.innerHTML = typeHTML;
  
  document.getElementById("vocab").appendChild(section);
  
}

function init(data) {

  for(let type in data.vocab) {
    handleVocab(type, data);
  }
  
}