const socket= io('http://localhost:3000')
const helloButton = document.getElementById('helloButton')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let clientBalls = {}

putWallsAround(0, 0, canvas.clientWidth, canvas.clientHeight)
let startX = 40 + Math.random() * 560
let startY = 40 + Math.random() * 400
let playerBall = new Ball(startX, startY, 40, 5)
playerBall.player = true
playerBall.maxSpeed = 5

// socket.on('serverToClient', (data) => {
//     console.log(data)
// })
socket.emit('newPlayer', {x: startX, y: startY})
socket.on('updatePlayers', (players) => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    playerFound = {}
    for(let id in players) {
        if(id !== socket.id && clientBalls[id] === undefined) {
            clientBalls[id] = new Ball(players[id].x, players[id].y, 40, 5)
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

function gameLogic() {
    socket.emit('update', {
        x: playerBall.pos.x,
        y: playerBall.pos.y
    })
}

userInput(playerBall)
requestAnimationFrame(mainLoop)