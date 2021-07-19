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
        this.isReserved = isReserved;
        this.reservationDate = reservationDate;
    }

    checkout() {
        this.owner = 'Unknown';
        this.isReserved = false;
        this.reservationDate = undefined;
    }
}