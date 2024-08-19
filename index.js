const express = require('express');
const { createServer } = require('node:http');
const PORT = 3000
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);

const cors = require('cors');
app.use(cors());

app.use(express.static(join(__dirname)));
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});

let players = {}

io.on('connection', connected);

function connected(socket) {
    socket.on('newPlayer', (data) => {
        console.log(`Player ${socket.id} joined`)
        players[socket.id] = data
        console.log(`Starting position: ${players[socket.id].x}, ${players[socket.id].y}`)
        console.log(`Total players: ${Object.keys(players).length}`)
        console.log('Players: \n', players)
        io.emit('updatePlayers', players)
    })

    socket.on('disconnect', () => {
        delete players[socket.id]
        console.log(`Player ${socket.id} left`)
        console.log(`Total players: ${Object.keys(players).length}`)
        console.log('Players: \n', players)
        io.emit('updatePlayers', players)
    })

    // socket.emit('serverToClient', 'Hello from server!')
    // socket.on('clientToServer', (data) => {
    //     console.log(data)
    // })
    // socket.on('clientToClient', (data) => {
    //     socket.broadcast.emit('serverToClient', data)
    // })

    // socket.on('update', (data) => {
    //     console.log(`{ ${data.x}, ${data.y} }`)
    // })
}

server.listen(PORT, () => {
  console.log(`server running at port: ${PORT}`);
});
