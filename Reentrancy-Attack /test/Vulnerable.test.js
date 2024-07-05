// Import the contract artifact
const Vulnerable = artifacts.require("Vulnerable");

contract("Vulnerable", (accounts) => {
    let vulnerableInstance;
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];

    beforeEach(async () => {
        vulnerableInstance = await Vulnerable.new({ from: owner });
    });

    it("should deposit ether", async () => {
        const amount = web3.utils.toWei("1", "ether");
        await vulnerableInstance.deposit({ from: user1, value: amount });
        const balance = await vulnerableInstance.balances(user1);
        assert.equal(balance.toString(), amount, "Balance not updated correctly after deposit");
    });

    it("should withdraw ether", async () => {
        const amount = web3.utils.toWei("1", "ether");
        await vulnerableInstance.deposit({ from: user1, value: amount });

        const initialBalance = await web3.eth.getBalance(user1);
        await vulnerableInstance.withdraw({ from: user1 });

        const finalBalance = await web3.eth.getBalance(user1);
        assert(finalBalance > initialBalance, "Withdrawal failed");
    });

    it("should return caller's address", async () => {
        const caller = await vulnerableInstance.callerAddress({ from: user1 });
        assert.equal(caller, user1, "Caller's address not returned correctly");
    });
});
