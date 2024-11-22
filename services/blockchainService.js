const Web3 = require('web3');

class BlockchainService {
    constructor() {
        this.web3 = new Web3(process.env.BLOCKCHAIN_PROVIDER);
        this.contract = new this.web3.eth.Contract(
            CONTRACT_ABI,
            process.env.CONTRACT_ADDRESS
        );
    }

    async recordTransaction(transactionData) {
        const hash = await this.contract.methods.recordTransaction(
            transactionData.id,
            transactionData.type,
            transactionData.timestamp
        ).send({
            from: process.env.WALLET_ADDRESS,
            gas: 2000000
        });

        return hash;
    }

    async verifyRecord(recordId) {
        return await this.contract.methods.verifyRecord(recordId).call();
    }
}
