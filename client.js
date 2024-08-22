const socket= io('http://localhost:3000')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let clientBalls = {}
let selfID

putWallsAround(0, 0, canvas.clientWidth, canvas.clientHeight)

socket.on('connect', () => {
    selfID = socket.id
    let startX = 40 + Math.random() * 560
    let startY = 40 + Math.random() * 400
    clientBalls[socket.id] = new Capsule(startX, startY, startX + 80, startY, 40, 5)
    clientBalls[socket.id].player = true
    clientBalls[socket.id].maxSpeed = 5
    userInput(clientBalls[socket.id])
    socket.emit('newPlayer', {x: startX, y: startY})
})

socket.on('updatePlayers', (players) => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    playerFound = {}
    for(let id in players) {
        if(id !== socket.id && clientBalls[id] === undefined) {
            clientBalls[id] = new Capsule(players[id].x, players[id].y, players[id].x + 80, players[id].y, 40, 5)
            clientBalls[id].maxSpeed = 5
        } 
        playerFound[id] = true
    }

    for(let id in clientBalls) {
        if(!playerFound[id]) {
            clientBalls[id].remove()
            delete clientBalls[id]
            break;
        }
    }
})

socket.on('positionUpdate', (playerPos) => {
    for(let i in playerPos) {
        if(clientBalls[i] === undefined)
            continue;
        clientBalls[i].setPosition(playerPos[i].x, playerPos[i].y, playerPos[i].angle)
    }
})

requestAnimationFrame(renderOnly)