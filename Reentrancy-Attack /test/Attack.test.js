// Import necessary modules
const Vulnerable = artifacts.require("Vulnerable");
const Attack = artifacts.require("Attack");

contract("Attack", (accounts) => {
    let vulnerableInstance;
    let attackInstance;
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];

    beforeEach(async () => {
        vulnerableInstance = await Vulnerable.new({ from: owner });
        attackInstance = await Attack.new(vulnerableInstance.address, { from: owner });
    });

    it("should perform a reentrancy attack after multiple donations", async () => {
        const amount1 = web3.utils.toWei("10", "ether");
        const amount2 = web3.utils.toWei("20", "ether");

        // Log vulnerable contract balance before donations
        const vulnerableBalanceBefore = await web3.eth.getBalance(vulnerableInstance.address);
        console.log(`Vulnerable contract balance before donations: ${web3.utils.fromWei(vulnerableBalanceBefore, "ether")} ETH`);

        // Donate Ether from multiple accounts
        await vulnerableInstance.deposit({ from: user1, value: amount1 });

        console.log(`Vulnerable contract balance after donations from USER1: ${web3.utils.fromWei(await web3.eth.getBalance(vulnerableInstance.address), "ether")} ETH`);
        await vulnerableInstance.deposit({ from: user2, value: amount2 });
        console.log(`Vulnerable contract balance after donations from USER2: ${web3.utils.fromWei(await web3.eth.getBalance(vulnerableInstance.address), "ether")} ETH`);

        // Log vulnerable contract balance after donations
        const vulnerableBalanceAfterDonations = await web3.eth.getBalance(vulnerableInstance.address);
        console.log(`Vulnerable contract balance after donations: ${web3.utils.fromWei(vulnerableBalanceAfterDonations, "ether")} ETH`);

        // Log attack contract balance before attack
        const attackBalanceBefore = await web3.eth.getBalance(attackInstance.address);
        console.log(`Attack contract balance before attack: ${web3.utils.fromWei(attackBalanceBefore, "ether")} ETH`);

        // Log amount before attack
        console.log(`Amount before attack: ${web3.utils.fromWei(amount1, "ether")} ETH`);

        // Execute reentrancy attack
        await attackInstance.attack({ from: user1, value: amount1 });

        // Log amount after attack
        const balanceAfterAttack = await web3.eth.getBalance(user1);
        console.log(`Amount after attack: ${web3.utils.fromWei(balanceAfterAttack, "ether")} ETH`);

        // Log vulnerable contract balance after attack
        const vulnerableBalanceAfterAttack = await web3.eth.getBalance(vulnerableInstance.address);
        console.log(`Vulnerable contract balance after attack: ${web3.utils.fromWei(vulnerableBalanceAfterAttack, "ether")} ETH`);

        // Log attack contract balance after attack
        const attackBalanceAfter = await web3.eth.getBalance(attackInstance.address);
        console.log(`Attack contract balance after attack: ${web3.utils.fromWei(attackBalanceAfter, "ether")} ETH`);

        // Check if the balance of the attacker (user1) has increased due to reentrancy
        assert(balanceAfterAttack > 0, "Reentrancy attack failed");

        // Ensure the vulnerable contract's balance is drained
        assert.equal(vulnerableBalanceAfterAttack.toString(), "0", "Vulnerable contract balance not drained");
    });
});
