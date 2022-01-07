const { app, BrowserWindow, ipcMain } = require('electron')
const dgram = require('dgram');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow();
});

const udpSocket = dgram.createSocket('udp4');

let countOfViewers = '0';

ipcMain.on('update-viewers', (event) => {
  event.returnValue = countOfViewers;
})

udpSocket.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  countOfViewers = msg.toString();
});

udpSocket.on('listening', () => {
  const address = udpSocket.address();
  console.log(`server listening ${address.address}:${address.port}`);
});


udpSocket.bind(4001);

