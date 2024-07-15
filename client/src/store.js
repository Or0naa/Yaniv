import { socket } from './helpers/socket.js';
import { create } from 'zustand';
import { cards } from './helpers/cards.js';

export const usePopupStore = create((set) => ({
    isOpen: false,
    content: null,
    openPopup: (content) => set({ isOpen: true, content }),
    closePopup: () => set({ isOpen: false, content: null }),
}))

export const useLanguageStore = create((set) => ({
    language: 'en', // 'heM' for Hebrew(man), 'heW' for Hebrew(woman) , 'en' for English
    toggleLanguage: (lan) => set({ language: lan }),


  }));

export const useUserStore = create((set, get) => ({
    user: {
        name: "player",
        image: "./girl1.png",
        id: null,

    },
    setUser: (user) => {
        set({ user });
    },
    addId: () => {
        socket.on('userId', (data) => {
            console.log("data from server: ", data);
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
    createGame: (numPlayers, yanivLine) => {
        const game = get().game;
        const setGame = get().setGame;
        const user = useUserStore.getState().user;
        let newCards = [...cards];
        newCards.sort(() => Math.random() - 0.5);
        let players = [user];

        let { userCards, deck: updatedDeck } = dealCards(newCards);
        newCards = updatedDeck;

        players[0].userCards = userCards;
        players[0].score = 0

        if (numPlayers > 1) {
            for (let i = 1; i < numPlayers; i++) {
                const { userCards, deck: updatedDeck } = dealCards(newCards);
                newCards = updatedDeck;
                players.push({
                    name: "player" + i,
                    image: "./boy1.png",
                    userCards: userCards,
                    score: 0,
                    id: null
                });
            }
        }

        console.log("players before ", players);

        let newGame = {
            deck: newCards,
            players: players,
            numPlayers: numPlayers,
            openCards: [],
            startGame: false,
            type: "friend",
            lastGame: null,
            winner: null,
            yanivLine: yanivLine,
            goToWinPage: false,
        };

        if (game.type === "computer") {
            set({ game: newGame });
        } else if (game.type === "friend") {
            socket.emit('game:create-room', newGame, user);
            socket.on('roomCreated', (roomId, players) => {
                set({ game: { ...newGame, roomId: roomId, players: players } });
            });

            console.log("players after ", players);
        }
    },

    joinGame: (roomId, user) => {
        console.log("joinGame");
        const setGame = get().setGame;
        const setUser = useUserStore.getState().setUser;
      
        socket.emit('game:join-room', roomId, user);
      
        socket.on('game:join-success', (room) => {
          console.log("room: ", room);
          setGame(room.game);
          setUser({ ...user, id: socket.id });
        });

        socket.on('roomFull', () => {
           return("")
        });
    },

    startGame: (game) => {
        console.log("startGame", game);
        const newDeck = game.deck
        let card = newDeck.shift()
        const turn = game.winner? game.currentPlayer: Math.floor(Math.random() * game.players.length);
        const start = {
            ...game,
            deck: newDeck,
            openCards: [card],
            startGame: true,
            goToWinPage: false,
            currentPlayer: turn,
            lastCard: [card]
        }
        socket.emit('move', game.roomId, start)
    },
    updateGame: (data) => {
        console.log("move, ", data)
        socket.emit('move', data.roomId, data)
    },

    socketBoardUpdate: () => {
        socket.on('updateBoard', (data) => {
          console.log("move, ", data);
          const setGame = get().setGame;
        //   const currentUser = useUserStore.getState().user;
        //   const updatedPlayers = data.players.map(player => 
        //     player.id === currentUser.id ? { ...player, ...currentUser } : player
        //   );
          setGame({ ...data});
        });
      },
    handlePlayersUpdate: (roomId, data) => {
        const game = get().game;
        const setGame = get().setGame;
        socket.emit('updatePlayerList', roomId, data);
        socket.on('updatePlayerList', (playerList) => {
            const updatedGame = {
                ...game,
                players: playerList,
            }
            setGame(updatedGame);
        });
    },
    declareYaniv: (playerId) => {
        const game = get().game;
        const startNewRound = get().startNewRound
        console.log("yaniv: ", game.players)
        const players = game.players;

        const currentGameState = players.map(player => ({
            ...player,
            userCards: [...player.userCards]  // יצירת עותק של הקלפים
        }));
    

        const declaringPlayer = players.find(p => p.id === playerId);
        const declaringPlayerScore = declaringPlayer.userCards.reduce((sum, card) => sum + card.value, 0);

        let winner = declaringPlayer.name;
        let isAsaf = false;

        players.forEach(player => {
            if (player.id !== playerId) {
                console.log(player.score)
                const playerScore = player.userCards.reduce((sum, card) => sum + card.value, 0);
                if (playerScore <= declaringPlayerScore) {
                    isAsaf = true;
                    winner = "ASAF";
                }
            }
        });

        if (isAsaf) {
            console.log("Asaf")
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
            if (player.score > 100) {
                set({ gameOver: true });
            } else if (player.score == 50) {
                player.score = 25;
            } else if (player.score == 100) {
                player.score = 50;
            }
        });

        const updatedGame = {
            ...game,
            players: players,
            winner: winner,
            goToWinPage: true,
            lastGame: currentGameState  // שמירת מצב המשחק הנוכחי
        }
        startNewRound(updatedGame);

    },
    startNewRound: (game) => {
        console.log("startNewRound", game)
        const newGame = {...game};
        let newCards = [...cards];
        newGame.deck = newCards.sort(() => Math.random() - 0.5);
        newGame.openCards = [];
        newGame.startGame = false;
        newGame.lastCard = [];
        
        // חלוקת קלפים חדשה לשחקנים
        newGame.players.forEach(player => {
            const { userCards, deck: updatedDeck } = dealCards(newGame.deck);
            player.userCards = userCards;
            newGame.deck = updatedDeck;
        });
    
        // שמירת המצב החדש במשחק
        set({ game: newGame });
        socket.emit('move', game.roomId, newGame);
    },
}));

const saruf = (cards) => {
    const suits = ["♠", "♥", "♣", "♦"];
    for (let suit of suits) {
        let numbers = cards.filter(card => card.suit === suit)
            .map(card => card.number)
            .sort((a, b) => a - b);
        
        // בדיקה לשלושה קלפים עוקבים
        for (let i = 0; i < numbers.length - 2; i++) {
            if (numbers[i + 1] === numbers[i] + 1 && numbers[i + 2] === numbers[i] + 2) {
                return true;
            }
        }
    }

    // בדיקה לשלושה קלפים עם אותו מספר
    const numberCounts = {};
    for (let card of cards) {
        numberCounts[card.number] = (numberCounts[card.number] || 0) + 1;
        if (numberCounts[card.number] === 3) {
            return true;
        }
    }

    return false;
}

const dealCards = (deck) => {
    let userCards = deck.slice(0, 5);
    deck = deck.slice(5);

    if (saruf(userCards)) {
        let replacement = [];
        while (replacement.length < 5) {
            let card = deck.shift();
            if (!saruf([...replacement, card])) {
                replacement.push(card);
            } else {
                deck.push(card);
            }
        }
        userCards = [...replacement];
    }

    return { userCards, deck };
};


