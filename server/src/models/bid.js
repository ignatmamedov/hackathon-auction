export class Bid {
    id;
    timestamp;
    lotId;
    userId;
    amount;

    constructor(id, timestamp, lotId, userId, amount) {
        this.id = id;
        this.timestamp = timestamp;
        this.lotId = lotId;
        this.userId = userId;
        this.amount = amount;
    }
}
