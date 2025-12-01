async function doShare(){
  const data = {title: document.title, url: location.href};
  if (navigator.share) {
    try { await navigator.share(data); return; }
    catch(e) { if (e.name === "AbortError") return; }
  }
  try { await navigator.clipboard.writeText(location.href); alert("Link copied!"); }
  catch(e) { prompt("Copy this link:", location.href); }
}
document.querySelectorAll(".share-button").forEach(b => b.addEventListener("click", doShare));
