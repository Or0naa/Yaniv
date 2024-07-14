const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
const suits = ["♠", "♥", "♣", "♦"];
const Joker = { number: "Joker", suit: "Joker", value: 0 };

export const cards = numbers.flatMap(number => 
    suits.map(suit => ({
        number,
        suit,
        value: number <= 10 ? parseInt(number, 10) : 10
    }))
).concat(Joker, Joker);
