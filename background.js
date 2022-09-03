async function copyText(text) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [text],
    function: function(text) {
      navigator.clipboard.writeText(text);
    }
  });
}

async function retrieveBibTeX(id) {
  const citeUrl = `https://scholar.google.com/scholar?q=info:${id}:scholar.google.com/&output=cite`
  const citeRes = await fetch(citeUrl);
  const citeTxt = await citeRes.text();
  const bibUrl = citeTxt.match(new RegExp(`"(https://scholar.googleusercontent.com/scholar.bib.*?)"`))[1].replaceAll('&amp;', '&');
  const bibRes = await fetch(bibUrl);
  const bibTxt = await bibRes.text();
  return bibTxt;
}

chrome.runtime.onMessage.addListener(async ({method, args}) => {
  if (method === "copy") {
    copyText(await retrieveBibTeX(...args));
  } else if (method === "download") {
    const bibtex = await retrieveBibTeX(args[0]);
    const id = bibtex.match(/[a-zA-Z]+[0-9]+[a-zA-Z]+/)[0]
    chrome.downloads.download({ url: args[1], filename: `${id.toLowerCase()}.pdf` })
  }
})
