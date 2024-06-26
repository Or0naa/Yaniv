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
        let userCards = newCards.slice(0, 5);
        newCards = newCards.slice(5);
    
        if (saruf(userCards)) {
            let replacement = [];
            while (replacement.length < 5) {
                let card = newCards.shift();
                if (!saruf([...replacement, card])) {
                    replacement.push(card);
                } else {
                    newCards.push(card);
                }
            }
            userCards = [...replacement];
        }
    
        players[0].userCards = userCards;
    
        let newGame = {
            deck: newCards,
            players: players,
            openCards: [],
            startGame: false,
            type: "friend",
        };
    
        if (game.type === "computer") {
            set({ game: newGame });
        } else if (game.type === "friend") {
            socket.emit('game:create-room', newGame, user);
            socket.on('roomCreated', (roomID, players) => {
                set({ game: { ...newGame, roomId: roomID, players: players } });
            });
    
            socket.on('game:join-success', (room) => {
                const updatedPlayers = room.players.map(p =>
                    p.id === user.id ? user : p
                );
                setGame({ ...room.game, players: updatedPlayers });
                // useUserStore.getState().setUser({ ...user, isHost: true });
            });
        }
    },
    
    joinGame: (roomId, user) => {
        const setGame = get().setGame;
        const setUser = useUserStore.getState().setUser;
    
        socket.emit('game:join-room', roomId, user);
    
        socket.off('game:join-success');
        socket.on('game:join-success', (room) => {
            let updatedGame = room.game;
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
    
            setUser({ ...user, userCards, id: socket.id });
            setGame({ ...updatedGame, roomId: roomId, players: room.players });
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
        const start = { ...game, deck: newDeck, openCards: [card], startGame: true, currentPlayer: turn, lastCard: [card] }
        console.log({start})
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

            const updatedUser = playerList.find(player => player.id === user.id);
            if (updatedUser) {
                setUser(updatedUser);
            }
        });
    },
    declareYaniv: (playerId) => {
        const game = get().game;
        const players = game.players;
        const declaringPlayer = players.find(p => p.id === playerId);
        const declaringPlayerScore = declaringPlayer.userCards.reduce((sum, card) => sum + card.value, 0);
        
        let winner = declaringPlayer;
        let isAsaf = false;
    
        players.forEach(player => {
          if (player.id !== playerId) {
            const playerScore = player.userCards.reduce((sum, card) => sum + card.value, 0);
            if (playerScore <= declaringPlayerScore) {
              winner = player;
              isAsaf = true;
            }
          }
        });
    
        if (isAsaf) {
          // אסף
          declaringPlayer.score += 30 + declaringPlayerScore;
        } else {
          // יניב
          players.forEach(player => {
            if (player.id !== playerId) {
              player.score += player.userCards.reduce((sum, card) => sum + card.value, 0);
            }
          });
        }
    
        // עדכון הניקוד
        players.forEach(player => {
          if (player.score >= 100) {
            // סיום המשחק
            set({ gameOver: true, winner: player });
          } else if (player.score >= 50 && player.score < 75) {
            player.score = 25;
          } else if (player.score >= 100 && player.score < 125) {
            player.score = 50;
          }
        });
    
        // התחלת סיבוב חדש
        const newGame = startNewRound(game);
        set({ game: newGame });
        socket.emit('move', game.roomId, newGame);
      },
    
      startNewRound: (game) => {
        // לוגיקה לחלוקת קלפים חדשים וכו'
        // ...
        return newGame;
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

const rePlaceCards = (deck) => {
    let replacement = [];
    while (replacement.length < 5) {
        let card = deck.shift();
        if (!saruf([...replacement, card])) {
            replacement.push(card);
        } else {
            updatedGame.deck.push(card);
        }
    }
    userCards = [...replacement];
    return (userCards, deck)
}

