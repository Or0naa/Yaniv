const express = require('express');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const schedule = require('node-schedule');

app.use(cors());

const server = createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: '*' } });

const rooms = {};
const players = [];

function getCurrentBackgroundImage() {
    const currentHour = new Date().getHours();
    if (currentHour == 0) { currentHour = 24; }
    return `./${currentHour}.png`; // +1 כי התמונות ממוספרות מ-1 עד 24
}

function sendBackgroundUpdate() {
    const imageUrl = getCurrentBackgroundImage();
    io.emit('backgroundUpdate', imageUrl);
    console.log(`Sent background update: ${imageUrl}`);
}

// תזמון עדכון הרקע בכל שעה עגולה
schedule.scheduleJob('0 * * * *', sendBackgroundUpdate);

io.on('connection', (socket) => {
    // שליחת הרקע הנוכחי לכל משתמש חדש שמתחבר
    socket.emit('backgroundUpdate', getCurrentBackgroundImage());

    socket.on('game:create-room', (game, userData) => {
        const newRoomId = generateRoomNumber();
        const newRoom = {
            game: game,
            players: [
                {
                    socketId: socket.id,
                    ...userData
                }
            ]
        }
        console.log(newRoom.players[0])
        rooms[newRoomId] = newRoom;
        socket.join(newRoomId);
        console.log(`${userData.name} created room ${newRoomId}`);
        const id = socket.id

        socket.emit('roomCreated', newRoomId, players);
        io.to(id).emit('userId', id);
    });

    socket.on('game:join-room', (roomId, userData) => {
        console.log(`Joining room ${roomId}`);
        const room = rooms[roomId];
        console.log({ room })
        if (room && room.players.length < 4) {
            room.players.push({
                socketId: socket.id,
                ...userData
            });
            room.game.roomId = roomId;
            socket.join(roomId);
            console.log(`${userData.name} joined room ${roomId}`);
            io.to(roomId).emit('game:join-success', room);
        } else {
            socket.emit('roomFull');
        }
    });

    socket.on('move', (roomId, game) => {
        console.log("move", roomId, game);
        const room = rooms[roomId];
        if (room) {
            room.game = game;
            io.to(roomId).emit('updateBoard', game);
            if (game.winner) {
                io.to(roomId).emit('game:end', game.winner);
            }
        }
    });

    socket.on('updatePlayerList', (roomId, playerList) => {
        const room = rooms[roomId];
        console.log(room)
        console.log('updatePlayerList', playerList, roomId);
        io.to(roomId).emit('updatePlayerList', playerList);
    });

    socket.on('disconnect', () => {
        const index = players.findIndex(player => player.id === socket.id);
        if (index !== -1) {
            players.splice(index, 1);
            io.to(roomID).emit('playerDisconnect', players);
        }
    });
});

function generateRoomNumber() {
    return String(Math.floor(Math.random() * 100000));
}

server.listen(3000, () => {
    console.log("Listening on port 3000");
    sendBackgroundUpdate(); // שליחת עדכון ראשוני בעת הפעלת השרת
});