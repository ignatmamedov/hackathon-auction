export class Lot {
    id;
    item;
    start;
    end;
    minBid;

    constructor(id, item, start, end, minBid) {
        this.id = id;
        this.item = item;
        this.start = start;
        this.end = end;
        this.minBid = minBid;
    }
}