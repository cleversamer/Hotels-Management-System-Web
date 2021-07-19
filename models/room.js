module.exports = class Room {
    
    constructor(owner, ID, price) {
        this.owner = owner;
        this.ID = ID;
        this.price = price;
        this.isReserved = false;
        this.reservationDate = undefined;
    }

    reserve(owner) {
        this.owner = owner;
        this.isReserved = true;
        this.reservationDate = new Date();
    }

    checkout() {
        this.owner = 'Empty';
        this.isReserved = false;
        this.reservationDate = undefined;
    }
}