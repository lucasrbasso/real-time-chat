const { ipcRenderer } = require('electron');

setInterval(() => {
  const numberOfViewers = (ipcRenderer.sendSync('update-viewers'));

  console.log(numberOfViewers);
  document.getElementById("count").innerHTML = numberOfViewers;

}, 1000)

