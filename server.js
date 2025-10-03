// Importa as bibliotecas necessárias
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// 1. Configuração do Servidor
const app = express();
const server = http.createServer(app);
// Configura o Socket.IO para ouvir o servidor HTTP
const io = socketIo(server); 

const port = 3000;

// Serve arquivos estáticos da pasta atual (index.html e style.css)
app.use(express.static(__dirname));

// Rota principal: serve o index.html quando alguém acessa a porta 3000
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Lógica do Socket.IO (Comunicação em Tempo Real)
// 'connection' é disparado quando um novo cliente se conecta
io.on('connection', (socket) => {
  console.log('Um usuário conectado.');

  // 'chat message' é o evento que definimos no front-end para enviar a mensagem
  socket.on('chat message', (data) => {
    // Exibe a mensagem recebida no console do servidor
    console.log(`Mensagem de ${data.user}: ${data.message}`);
    
    // Envia a mensagem para *todos* os clientes conectados (incluindo quem enviou)
    // O 'io.emit' é o que faz o chat ser em tempo real
    io.emit('chat message', data);
  });

  // 'disconnect' é disparado quando um cliente se desconecta (fecha a aba)
  socket.on('disconnect', () => {
    console.log('Um usuário desconectado.');
  });
});

// 3. Inicia o Servidor
server.listen(port, () => {
  console.log(`Servidor de Chat rodando em http://localhost:${port}`);
});