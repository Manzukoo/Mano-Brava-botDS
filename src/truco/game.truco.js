const Player = require('./player.truco.js');
const Card = require('./card.truco.js');

class Truco {
    constructor(gameId, guildId, channelId) {
        this.gameId = gameId;
        this.guildId = guildId;
        this.channelId = channelId;
        this.players = new Map(); // playerId => Player instance
        this.table = [];
        this.cards = this._initCards();
        this.state = 'esperando_jugadores';
        this.turn = null;
        this.currentCall = null; // 'truco', 'retruco', 'vale4', 'envido', 'real_envido', 'falta_envido', null
        this.playerSaid = null;
        this.points = 1;
        this.callResolved = false;
        this.TrucoSaidInHand = false;
        this.envidoSaidInHand = false;
        this.parda = false;
    }

    _initCards() {
        const suits = Object.keys(Card.suits_code);
        const nums = ['1', '2', '3', '4', '5', '6', '7', '10', '11', '12'];
        const mazo = [];
        for (const palo of suits) {
            for (const valor of nums) {
                while (!mazo.includes(`${valor}${palo.toUpperCase()}`)) { // Evitar meter valores repetidos
                    mazo.push(`${valor}${palo.toUpperCase()}`);
                }
            }
        }
        // Lógica para mezclar el mazo
        return mazo.sort(() => Math.random() - 0.5);
    }

    addPlayer(uId, uName) {
        if (this.players.size < 2 && !this.players.has(uId)) {
            const newPlayer = new Player(uId, uName);
            this.players.set(uId, newPlayer);
            return true;
        }
        return false;
    }

    getAnotherPlayer(uId) {
        for (const playerId of this.players.keys()) { // Buscamos al otro usuario de la partida.
            if (playerId !== uId) return this.players.get(playerId);
        }
    }

    getTanto(uId) {
        if (!this.players.has(uId)) {
            console.error(`Error: Jugador con ID ${uId} no encontrado.`);
            return -1;
        }
        const player = this.players.get(uId);

        let maxTanto = 0; // Guardará el tanto más alto encontrado
        let highestEnvidoValue = 0; // Guardará el valor de envido más alto de una sola carta

        const playerHandCards = player.hand;

        // Almacenar cartas por palo para facilitar la búsqueda
        const cardsBySuit = {
            'Espada': [],
            'Basto': [],
            'Oro': [],
            'Copa': [],
        };

        // Rellenar cardsBySuit y encontrar el valor de envido individual más alto
        for (const card of playerHandCards) {
            const suitName = card.suit;
            const envidoVal = card.getEnvidoValue();

            if (cardsBySuit[suitName]) { // Verificar que el palo es válido
                cardsBySuit[suitName].push({ card: card, envidoValue: envidoVal });
            }
            else {
                console.warn(`Palo desconocido para la carta ${card.card_code}: ${suitName}`);
            }

            if (envidoVal > highestEnvidoValue) {
                highestEnvidoValue = envidoVal;
            }
        }

        // Buscar envidos (palos repetidos)
        for (const suitName in cardsBySuit) {
            const suitCards = cardsBySuit[suitName];

            if (suitCards.length >= 2) { // Hay al menos dos cartas del mismo palo
                // Ordenar por valor de envido para tomar las dos más altas si hay 3
                suitCards.sort((a, b) => b.envidoValue - a.envidoValue);

                const sum = suitCards[0].envidoValue + suitCards[1].envidoValue;
                const currentTanto = sum + 20;
                if (currentTanto > maxTanto) {
                    maxTanto = currentTanto;
                }
            }
        }

        // 3. Si no se encontró ningún tanto con palo, el tanto es la carta de mayor valor de envido
        if (maxTanto === 0) { // Si maxTanto sigue siendo 0, significa que no hubo palos repetidos
            maxTanto = highestEnvidoValue;
        }

        console.log(`Calculado tanto para ${player.name}: ${maxTanto}`);
        return maxTanto;
    }

    repartirCartas() {
        if (this.players.size !== 2) {
            console.warn("No se pueden repartir cartas: número de jugadores incorrecto.");
            return false;
        }

        const playersIterator = this.players.values();
        const firstPlayer = playersIterator.next().value;
        const secondPlayer = playersIterator.next().value;

        if (!this.cards || this.cards.length < 6) {
             console.error("Error: Mazo de cartas no inicializado o insuficiente para repartir.");
             return false;
        }

        for (let i = 0; i < 3; i++) {
            secondPlayer.setHand(new Card(this.cards.shift()));
            firstPlayer.setHand(new Card(this.cards.shift()));
        }

        firstPlayer.tanto = this.getTanto(firstPlayer.id);

        secondPlayer.tanto = this.getTanto(secondPlayer.id);

        secondPlayer.isHand = true;
        secondPlayer.turn = true;

        return true;
    }

    matarMano(playerId) {
        const anotherPlayer = this.getAnotherPlayer(playerId);
        const player = this.players.get(playerId);

        // --- Verificaciones de existencia de jugadores ---
        if (!player) return false;
        if (!anotherPlayer) return false;


        const cardInTable = player.cardInTable; // Esto busca en la mano del jugador
        const anotherCardInTable = anotherPlayer.cardInTable; // Esto busca en la mano del otro jugador


        if (!cardInTable || !anotherCardInTable) return false; // Una o ambas cartas no se encontraron

        player.setCardInTable(null);
        anotherPlayer.setCardInTable(null);

        if (cardInTable.trucoValue > anotherCardInTable.trucoValue || (this.parda && cardInTable.trucoValue >= anotherCardInTable.trucoValue)) {
            return { uId: player.id, card_win: cardInTable.card_name, card_defeat: anotherCardInTable.card_name };
        }
        else {
            return { uId: anotherCardInTable.id, card_win: anotherCardInTable.card_name, card_defeat: cardInTable.card_name };
        }
    }

    jugarCarta(playerId, card_code) {
        const player = this.players.get(playerId);
        const anotherPlayer = this.getAnotherPlayer(playerId);
        const card = new Card(card_code);

        if (!player.turn || player.hand.length < 1 || !player.hasCard(card_code)) return false;

        player.removeFromHand(card_code);

        player.turn = player.turn ? false : true;
        anotherPlayer.turn = anotherPlayer.turn ? false : true;

        this.table.push(card_code);
        player.setCardInTable(card);
        return card;
    }

    /*cantarTruco(playerId) {
        // Lógica para cantar truco
    }*/
}

module.exports = Truco;