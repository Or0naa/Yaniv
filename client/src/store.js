import { socket } from './socket';
import { create } from 'zustand';
import { cards } from './cards.js';

export const usePopupStore = create((set) => ({
    isOpen: false,
    content: null,
    openPopup: (content) => set({ isOpen: true, content }),
    closePopup: () => set({ isOpen: false, content: null }),
}))

export const useUserStore = create((set, get) => ({
    user: {
        name: "player",
        image: "./girl1.png",

    },
    setUser: (user) => {
        set({ user });
        // const game = useGameStore.getState().game;
        // if (game.type === "friend" && game.roomId) {
        //     socket.emit('updateUser', game.roomId, user);
        // }
    },
    addId: () => {
        socket.on('userId', (data) => {
            console.log({ data })
            const user = get().user;
            const setUser = get().setUser;
            setUser({ ...user, id: data });
        })
    }
}));

export const useGameStore = create((set, get) => ({
    game: {
        type: "friend",
    },
    setGame: (game) => set({ game }),
    createGame: () => {
        const game = get().game;
        const setGame = get().setGame;
        const user = useUserStore.getState().user;
        let newCards = [...cards];
        newCards.sort(() => Math.random() - 0.5);
        let players = [user];
        let userCards = newCards.slice(0, 5)
        newCards = newCards.slice(5);
        if (saruf(userCards)) {
            let replacement = []
            while (replacement.length < 5) {
                let card = newCards.shift()
                if (!saruf([...replacement, card])) {
                    replacement.push(card)
                }
                else {
                    newCards.push(card)
                }
            }
            userCards = [...replacement]
        }
        players[0].userCards = userCards;
        let newGame = {
            deck: newCards,
            players: players,
            openCards: [],
            startGame: false,
        }
        if (game.type === "computer") {
            set({ game: newGame });
        } else if (game.type === "friend") {
            socket.emit('game:create-room', newGame, user);
            socket.on('roomCreated', (roomID) => {
                console.log('Room created', roomID);
                set({ game: { ...newGame, roomId: roomID } });
            });
            socket.on('game:join-success', (room) => {
                console.log('game:join-success', room);
                setGame({ ...room.game, players: room.players });
                useUserStore.getState().setUser({ ...user, isHost: true, socketId: room.players[0].socketId });
            });

        }
    },
    joinGame: (roomId, user) => {
        console.log(roomId, user);
        const setGame = get().setGame;
        const setUser = useUserStore.getState().setUser;

        socket.emit('game:join-room', roomId, user);

        socket.off('game:join-success');
        socket.on('game:join-success', (room) => {
            console.log("room: ", room);

            // יצירת עותק עמוק של מצב המשחק
            let updatedGame = JSON.parse(JSON.stringify(room.game));

            let userCards = updatedGame.deck.slice(0, 5);
            updatedGame.deck = updatedGame.deck.slice(5);

            if (saruf(userCards)) {
                let replacement = [];
                while (replacement.length < 5) {
                    let card = updatedGame.deck.shift();
                    if (!saruf([...replacement, card])) {
                        replacement.push(card);
                    } else {
                        updatedGame.deck.push(card);
                    }
                }
                userCards = [...replacement];
            }

            // עדכון המשתמש עם הקלפים החדשים והשמירה של ה-socketId
            const updatedUser = { ...user, userCards, socketId: socket.id, id: socket.id };
            setUser(updatedUser);

            // עדכון רשימת השחקנים
            const updatedPlayers = updatedGame.players.map(p =>
                p.socketId === updatedUser.id ? updatedUser : p
            );

            // אם השחקן לא נמצא ברשימה, נוסיף אותו
            if (!updatedPlayers.some(p => p.id === updatedUser.id)) {
                updatedPlayers.push(updatedUser);
            }

            updatedGame = {
                ...updatedGame,
                roomId: roomId,
                players: updatedPlayers,
            };

            setGame(updatedGame);

            // שליחת העדכון לשרת
            socket.emit('move', roomId, updatedGame);
        });

        socket.on('roomFull', () => {
            console.log('roomFull');
        });
    },
    startGame: () => {
        const game = get().game;
        const newDeck = game.deck
        let card = newDeck.shift()
        const turn = Math.floor(Math.random() * game.players.length);
        const start = { ...game, deck: newDeck, openCards: [card], startGame: true, currentPlayer: turn, lastCard:[card] }
        socket.emit('move', game.roomId, start)
    },
    updateGame: (data) => {
        socket.emit('move', data.roomId, data)
    },

    socketBoardUpdate: () => {
        socket.on('updateBoard', (data) => {
            const setGame = get().setGame
            console.log("update", data)
            setGame(data)
        });
    },
    handlePlayersUpdate: (roomId, data) => {
        console.log(roomId)
        const game = get().game;
        const user = useUserStore.getState().user;
        const setUser = useUserStore.getState().setUser;
        socket.emit('updatePlayerList', roomId, data);
        socket.on('updatePlayerList', (playerList) => {
            console.log("coming playerList:", playerList);
            set(state => ({
                game: {
                    ...state.game,
                    players: playerList,
                }
            }));

            // Update the user's sign based on the new player list
            const updatedUser = playerList.find(player => player.socketId === user.socketId);
            if (updatedUser) {
                setUser({ ...user, sign: updatedUser.sign });
            }
        });
    },
}));

const saruf = (cards) => {
    console.log("checking for saruf", cards)
    const suits = ["♠", "♥", "♣", "♦"]
    for (let suit of suits) {
        let numbers = cards.filter(card => card.suit === suit)
            .map(card => card.number)
            .sort((a, b) => a - b)
        for (let i; i < numbers.length - 2; i++)
            if (numbers[i + 1] === numbers[i] + 1 && numbers[i + 2] === numbers[i] + 2) {
                return true;
            } else if (numbers[i + 1] === numbers[i] && numbers[i + 2] === numbers[i]) {
                return true;
            }
    }
    return false;
}

