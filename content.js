document
  .querySelectorAll('[data-cid]:not([id])')
  .forEach((element) => {
    const a = document.createElement('a');
    a.innerHTML = '🔖';
    a.href = 'javascript:void(0)';
    a.style = 'padding: 0 1em; font-size: small;';
    a.classList.add('gsp-copy-bibtex');
    a.onclick = async () => {
      chrome.runtime.sendMessage({method: "copy", args: [element.dataset.cid]});
    };
    element.querySelector('h3').appendChild(a);
    element.querySelectorAll("a").forEach((a)=>{
      if(a.innerHTML.match(/\[PDF\]/)) {
        const url = a.href;
        a.href = 'javascript:void(0)';
        a.parentNode.setAttribute('ontouchstart', null);
        a.onclick = async () => {
          chrome.runtime.sendMessage({method: "download", args: [element.dataset.cid, url]})
          return false
        }
      }
    });
  });

chrome.runtime.onMessage.addListener(async ({method, args}) => {
  if (method === "copy") {
    navigator.clipboard.writeText(args[0]);
  }
})
