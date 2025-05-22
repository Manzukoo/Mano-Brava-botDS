class Card {
    static cards_code = [
        ['1E'],
        ['1B'],
        ['7E'],
        ['7O'],
        ['3E', '3B', '3O', '3C'],
        ['2E', '2B', '2O', '2C'],
        ['1O', '1C'],
        ['12E', '12B', '12O', '12C'],
        ['11E', '11B', '11O', '11C'],
        ['10E', '10B', '10O', '10C'],
        ['7B', '7C'],
        ['6E', '6B', '6O', '6C'],
        ['5E', '5B', '5O', '5C'],
        ['4E', '4B', '4O', '4C'],
    ];
    static suits_code = {
        'E': 'Espada',
        'B': 'Basto',
        'O': 'Oro',
        'C': 'Copa',
    };

    constructor(card_code) {
        this.card_code = card_code;
        this.value = 0;
        this.suit = '';

        this._initCard(card_code);

        this.card_name = `${this.value} de ${this.suit}`;
        this.trucoValue = this.getTrucoValue();
        this.envidoValue = this.getEnvidoValue();

    }

    _initCard(card_code) {
        const regex = /(\d+)([A-Za-z]+)/;
        const match = card_code.match(regex);
        if (match) {
            this.value = parseInt(match[1], 10);
            this.suit = Card.suits_code[match[2]];
        }
        else {
            console.warn(`Código de carta inválido: "${card_code}". Asignando valores por defecto.`);
            this.value = 0;
            this.suit = 'UNKNOWN';
        }
    }

    getApodo() {
        switch (this.card_code) {
            case '1E': return 'Ancho de Espada';
            case '1B': return 'Ancho de Basto';
            case '1O': return 'Ancho Falso';
            case '1C': return 'Ancho Falso';
            case '7B': return 'Siete Falso';
            case '7C': return 'Siete Falso';
            case '12E': case '12B': case '12O': case '12C': return 'Rey';
            case '11E': case '11B': case '11O': case '11C': return 'Caballo';
            case '10E': case '10B': case '10O': case '10C': return 'Sota';
            default: return undefined;
        }
    }

    getTrucoValue() {
        const totalTrucoValues = Card.cards_code.length; // Cantidad total de niveles de valor de Truco (ej. 14)

        for (let i = 0; i < totalTrucoValues; i++) {
            if (Card.cards_code[i].includes(this.card_code)) {
                // Si la carta está en el índice 'i', su valor de Truco real será:
                // (Total de valores posibles) - 1 - (índice actual)
                // Ejemplo:
                // Si '1E' está en el índice 0: 14 - 1 - 0 = 13 (el valor más alto)
                // Si '4E' está en el índice 13: 14 - 1 - 13 = 0 (el valor más bajo)
                return (totalTrucoValues - 1) - i;
            }
        }
        return { success: false, messsage: 'Carta no encontrada' }; // Carta no encontrada
    }

    getEnvidoValue() {
        return this.value >= 1 && this.value <= 7 ? this.value : 0;
    }

    toString() {
        return this.card_name;
    }
}

module.exports = Card;
