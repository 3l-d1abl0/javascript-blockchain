class Transaction{

    constructor(amount , from, to){
        this.amount = amount,
        this.sender = from,
        this.recipient = to
    }
}

module.exports = Transaction;