const decideMove = (computerCards, openCard, deck, openCards, previousPlayerTakenCards) => {
    // מחשב את סך ערכי הקלפים שבידי המחשב
    const totalValue = computerCards.reduce((sum, card) => sum + card.value, 0);

    // בודק אם המחשב צריך להכריז יניב
    if (totalValue <= 7) {
        return { action: 'declareYaniv' };
    }

    // פונקציה עזר לבדיקת זוגות ושלישיות
    const getCardCounts = (cards) => {
        const cardCounts = {};
        cards.forEach(card => {
            // מתעלם מקלפי ג'וקר
            if (card.value !== 'JOKER') {
                // סופר את מספר הקלפים לפי ערכים
                cardCounts[card.value] = (cardCounts[card.value] || 0) + 1;
            }
        });
        return cardCounts;
    };

    // פונקציה עזר לבדוק אם קלפים הם רצף
    const isSequence = (cards) => {
        const values = cards.map(card => card.value).sort((a, b) => a - b);
        for (let i = 1; i < values.length; i++) {
            if (values[i] !== values[i - 1] + 1) {
                return false;
            }
        }
        return true;
    };

    // מחשב את מספר הקלפים לפי ערכים
    const cardCounts = getCardCounts(computerCards);

    // מוצא זוגות או שלישיות אם קיימים
    const pairsOrTriples = [];
    for (let value in cardCounts) {
        if (cardCounts[value] >= 2) {
            pairsOrTriples.push(computerCards.filter(card => card.value == value));
        }
    }

    // מוצא רצפים אם קיימים
    const sequences = [];
    for (let suit of ['♥', '♠', '♦', '♣']) {
        const suitedCards = computerCards.filter(card => card.suit === suit);
        for (let i = 0; i < suitedCards.length; i++) {
            for (let j = i + 2; j <= suitedCards.length; j++) {
                const potentialSequence = suitedCards.slice(i, j);
                if (isSequence(potentialSequence)) {
                    sequences.push(potentialSequence);
                }
            }
        }
    }

    // בודק אם יש זוגות, שלישיות או רצפים לשים
    let cardsToThrow = [];
    if (sequences.length > 0) {
        cardsToThrow = sequences[0];
    } else if (pairsOrTriples.length > 0) {
        cardsToThrow = pairsOrTriples[0];
    } else {
        // אם אין זוגות או רצפים, בוחר את הקלף לזרוק בהתחשב בקלפים שהשחקן הקודם לקח
        cardsToThrow = [computerCards.reduce((maxCard, card) => {
            // מתעלם מקלפי ג'וקר ובודק את הקלף בעל הערך הגבוה ביותר
            if (card.value !== 'JOKER' && (maxCard.value === 'JOKER' || card.value > maxCard.value)) {
                // אם הקלף נמצא בקלפים שהשחקן הקודם לקח, מדלג עליו
                if (previousPlayerTakenCards.some(prevCard => prevCard.value === card.value)) {
                    return maxCard;
                }
                return card;
            }
            return maxCard;
        }, computerCards[0])];
    }

    // בודק אם המחשב צריך לקחת את הקלף הפתוח
    const shouldTakeOpenCard = openCard && cardCounts[openCard.value] >= 1;

    // לוקח את הקלף הפתוח או קלף מהחפיסה
    const newCard = shouldTakeOpenCard ? openCard : deck.shift();

    // מעדכן את קלפי המחשב והערימה
    const newCards = computerCards.filter(card => !cardsToThrow.includes(card)).concat(newCard);
    const newOpenCards = openCards.concat(cardsToThrow);

    // מחזיר את הפעולה שבוצעה, הקלפים שנזרקו, קלפי המחשב המעודכנים והערימה המעודכנת
    return {
        action: shouldTakeOpenCard ? 'takeOpenCard' : 'takeFromDeck',
        cardsToThrow,
        newCards,
        newOpenCards
    };
};

// שימוש בדוגמה:
const computerCards = [
    { suit: '♥', value: 2 },
    { suit: '♠', value: 3 },
    { suit: '♦', value: 4 },
    { suit: '♣', value: 5 },
    { suit: '♥', value: 6 }
];

const openCard = { suit: '♠', value: 4 };
const deck = [
    { suit: '♠', value: 7 },
    { suit: '♣', value: 8 },
    { suit: '♦', value: 9 },
    // ... קלפים נוספים
];
const openCards = [
    { suit: '♣', value: 1 }
];
const previousPlayerTakenCards = [
    { suit: '♦', value: 3 },
    { suit: '♠', value: 5 }
];

// קריאה לפונקציה והצגת המהלך שבוצע
const move = decideMove(computerCards, openCard, deck, openCards, previousPlayerTakenCards);
console.log(move);
