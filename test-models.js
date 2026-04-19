const url = "https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyAXRSknXGo2-XQ8oBDS3NQGkgA4M4Ev13M";
fetch(url).then(r => r.json()).then(d => {
  console.log(d.models.map(m => m.name));
});
