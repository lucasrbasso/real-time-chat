import 'dotenv/config';
import express from 'express';
import dgram from 'dgram';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { router } from './routes';

const app = express();
app.use(cors());
const serverHttp = http.createServer(app);

const udpSocket = dgram.createSocket('udp4');

const io = new Server(serverHttp, {
  cors: {
    origin: '*',
  },
});

let numClients = 0;

io.on('connection', socket => {
  console.log(`Usuário conectado no socket${socket.id}`);
  if (numClients === 0) {
    numClients = 1;
  } else {
    numClients++;
  }

  udpSocket.send(numClients.toString(), 4001);

  socket.on('disconnect', () => {
    numClients--;
    udpSocket.send(numClients.toString(), 4001);
    console.log(numClients);
  });
});

app.use(express.json());
app.use(router);

app.get('/github', (request, response) => {
  response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
  );
});

app.get('/signin/callback', (request, response) => {
  const { code } = request.query;

  return response.json(code);
});

export { serverHttp, io, udpSocket };
