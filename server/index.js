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

function getCurrentBackgroundImage() {
    const currentHour = new Date().getHours();
    if (currentHour == 0) { return './24.png'; }
    return `./${currentHour}.png`; // +1 כי התמונות ממוספרות מ-1 עד 24
}

function sendBackgroundUpdate() {
    const imageUrl = getCurrentBackgroundImage();
    io.emit('backgroundUpdate', imageUrl);
}

// תזמון עדכון הרקע בכל שעה עגולה
schedule.scheduleJob('0 * * * *', sendBackgroundUpdate);

io.on('connection', (socket) => {
    // שליחת הרקע הנוכחי לכל משתמש חדש שמתחבר
    socket.emit('backgroundUpdate', getCurrentBackgroundImage());

    socket.on('game:create-room', (game, userData) => {
        const newRoomId = generateRoomNumber();
        const newRoom = {
            game,
            players: [
                {
                    id: socket.id,
                    ...userData
                }
            ]
        };
        rooms[newRoomId] = newRoom;
        socket.join(newRoomId);
        socket.emit('roomCreated', newRoomId, newRoom.players);
        socket.emit('userId', socket.id);
    });
    

    socket.on('game:join-room', (roomId, userData) => {
        const room = rooms[roomId];
        if (room && room.players.length < 4) {
            const newPlayer = {
                ...userData,
                id: socket.id
            };
            room.players.push(newPlayer); // Push the new player into the players array
            socket.join(roomId);
            io.to(roomId).emit('game:join-success', room);
        } else {
            socket.emit('roomFull');
        }
    });

    socket.on('move', (roomId, game) => {
        const room = rooms[roomId];
        console.log({room})
        if (room) {
            room.game = game;
            room.players = game.players; // עדכון רשימת השחקנים בחדר
            io.to(roomId).emit('updateBoard', game);
        }
    });
    socket.on('updatePlayerList', (roomId, playerList) => {
        const room = rooms[roomId];
        if (room) {
            room.players = playerList; // עדכון רשימת השחקנים בחדר
            io.to(roomId).emit('updatePlayerList', playerList);
        }
    });
    

    socket.on('disconnect', () => {
    console.log("player disconnect")
    });
});

function generateRoomNumber() {
    return String(Math.floor(Math.random() * 100000));
}

server.listen(3000, () => {
    console.log("Listening on port 3000");
    sendBackgroundUpdate(); // שליחת עדכון ראשוני בעת הפעלת השרת
});