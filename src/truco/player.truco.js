class Player {
    constructor(userId, username) {
        this.id = userId;
        this.username = username;
        this.hand = [];
        this.cardInTable = null;
        this.cardsKilled = 0;
        this.isHand = false; // Es mano ?
        this.turn = false; // Es su turno ?
        this.points = 0;
        this.tanto = 0;
        this.trucoSaid = false; // Cantó el truco durante esta mano ?
        this.envidoSaid = false; // Cantó el envido durante esta mano ?
        this.acceptedTruco = null; // Aceptó el truco ? (true, false, null)
        this.acceptedEnvido = null; // Aceptó el envido ? (true, false, null)
    }

    getCard(card_code_to_find) {
        const foundCard = this.hand.find(card => {
            const isMatch = card.card_code === card_code_to_find;
            return isMatch;
        });

        return foundCard;
    }

    setHand(card) {
        this.hand.push(card);
    }

    setCardInTable(card_code) {
        this.cardInTable = card_code;
    }

    removeFromHand(card_code) {
        const index = this.hand.findIndex(card => card.card_code === card_code);

        if (index > -1) {
            this.hand.splice(index, 1);
            return { success: true, message: `Se eliminó la carta de la mano correctamente. ${this.username}:${this.id} -> ${card_code}`, data: this.hand };
        }
        return { success: false, message: `No se encontró la carta a eliminar de la mano.`, data: this.hand };
    }

    resetHand() {
        this.hand = [];
    }

    addPoints(points) {
        this.points += points;
    }

    resetPoints() {
        this.points = 0;
    }

    hasCard(card_code) {
        return this.hand.some(cardInstance => cardInstance.card_code === card_code);
    }

    // Métodos para gestionar los cantos
    sayTruco() {
        if (!this.acceptedTruco) return { success: false, message: `No se pudo cantar truco.`, data: null };
        if (!this.turn) return { success: false, message: `No es tu turno para cantar truco.`, data: null };
        if (this.trucoSaid) return { success: false, message: `Ya has cantado truco.`, data: null };

        this.trucoSaid = true;
        return { success: true, message: `Se cantó truco.`, data: Player };
    }

    resetTrucoSaid() {
        this.trucoSaid = false;
    }

    sayEnvido() {
        if (!this.acceptedEnvido) return { success: false, message: `No se pudo cantar envido.`, data: null };
        if (!this.turn) return { success: false, message: `No es tu turno para cantar envido.`, data: null };
        if (this.envidoSaid) return { success: false, message: `Ya has cantado envido.`, data: null };

        this.envidoSaid = true;
        return { success: true, message: `Se cantó envido.`, data: Player };
    }

    resetEnvidoSaid() {
        this.envidoSaid = null;
    }

    setAcceptedTruco(accepted) {
        this.acceptedTruco = accepted;
    }

    resetAcceptedTruco() {
        this.acceptedTruco = null;
    }

    setAcceptedEnvido(accepted) {
        this.acceptedEnvido = accepted;
    }

    resetAcceptedEnvido() {
        this.acceptedEnvido = null;
    }

    // ... otros métodos relacionados con el estado del jugador ...

    getPlayerInfo() {
        return {
            id: this.id,
            username: this.username,
            hand: [...this.hand], // Devolver una copia para evitar modificaciones externas
            points: this.points,
            trucoSaid: this.trucoSaid,
            envidoSaid: this.envidoSaid,
            acceptedTruco: this.acceptedTruco,
            acceptedEnvido: this.acceptedEnvido,
        };
    }
}

module.exports = Player;
