const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Escrow', function () {
  let contract;
  let depositor;
  let beneficiary;
  let arbiter;
  const deposit = ethers.utils.parseEther('1');
  beforeEach(async () => {
    depositor = ethers.provider.getSigner(0);
    beneficiary = ethers.provider.getSigner(1);
    arbiter = ethers.provider.getSigner(2);
    const Escrow = await ethers.getContractFactory('Escrow');
    contract = await Escrow.deploy(
      arbiter.getAddress(),
      [beneficiary.getAddress()],
      {
        value: deposit,
      }
    );
    await contract.deployed();
  });

  it('should be funded initially', async function () {
    let balance = await ethers.provider.getBalance(contract.address);
    expect(balance).to.eq(deposit);
  });

  describe('attempted approval from address other than the arbiter', () => {
    it('should revert', async () => {
      await expect(contract.connect(beneficiary).approve()).to.be.reverted;
      await expect(contract.connect(depositor).approve()).to.be.reverted;
    });
  });

  describe('attempted cancellation from address other than the arbiter', () => {
    it('should revert', async () => {
      await expect(contract.connect(beneficiary).cancel()).to.be.reverted;
      await expect(contract.connect(depositor).cancel()).to.be.reverted;
    });
  });

  describe('after cancellation by the arbiter', async () => {
    it('depositor should be refunded', async () => {
      const contractBefore = await ethers.provider.getBalance(contract.address);
      const depositorBefore = await ethers.provider.getBalance(depositor.getAddress());

      const txn = await contract.connect(arbiter).cancel();
      await txn.wait();

      const depositorAfter = await ethers.provider.getBalance(depositor.getAddress());
      expect(depositorBefore.add(contractBefore)).to.eq(depositorAfter);
    });

    it('contract value should be 0', async () => {
      const txn = await contract.connect(arbiter).cancel();
      await txn.wait();

      const contractAfter = await ethers.provider.getBalance(contract.address);
      expect(contractAfter).to.equal(0);
    });

    it('should not be able to be approved', async () => {
      const txn = await contract.connect(arbiter).cancel();
      await txn.wait();

      await expect(contract.connect(arbiter).approve()).to.be.reverted;
    });
  });

  describe('after approval from the arbiter', () => {
    it('should transfer balance', async () => {
      const before = await ethers.provider.getBalance(beneficiary.getAddress());
      const approveTxn = await contract.connect(arbiter).approve();
      await approveTxn.wait();
      const after = await ethers.provider.getBalance(beneficiary.getAddress());
      expect(after.sub(before)).to.eq(deposit);
    });

    it('contract value should be 0', async () => {
      const txn = await contract.connect(arbiter).approve();
      await txn.wait();

      const contractAfter = await ethers.provider.getBalance(contract.address);
      expect(contractAfter).to.equal(0);
    });

    it('should not be able to be cancelled', async () => {
      const txn = await contract.connect(arbiter).approve();
      await txn.wait();

      await expect(contract.connect(arbiter).cancel()).to.be.reverted;
    });
  });

  describe('2 beneficiaries: after approval from the arbiter', () => {
    it('should transfer correct amount', async () => {
      const beneficiary2 = ethers.provider.getSigner(3);
      const valueToSend = ethers.utils.parseEther('2');
      const valueToGet = ethers.utils.parseEther('1');

      //deploy make and deploy contract
      const Escrow = await ethers.getContractFactory('Escrow');
      const thisContract = await Escrow.deploy(
        arbiter.getAddress(),
        [beneficiary.getAddress(), beneficiary2.getAddress()],
        {
          value: valueToSend,
        }
      );
      await thisContract.deployed();
  
      //get balances
      const before1 = await ethers.provider.getBalance(beneficiary.getAddress());
      const before2 = await ethers.provider.getBalance(beneficiary2.getAddress());

      //approve
      const approveTxn = await thisContract.connect(arbiter).approve();
      await approveTxn.wait();
      
      //get balances
      const after1 = await ethers.provider.getBalance(beneficiary.getAddress());
      const after2 = await ethers.provider.getBalance(beneficiary2.getAddress());

      //make sure correct
      expect(after1.sub(before1)).to.eq(valueToGet);
      expect(after2.sub(before2)).to.eq(valueToGet);
    });
  });

  describe('3 beneficiaries: after approval from the arbiter', () => {
    it('should transfer correct amount', async () => {
      const beneficiary2 = ethers.provider.getSigner(3);
      const beneficiary3 = ethers.provider.getSigner(4);
      const valueToSend = ethers.utils.parseEther('3');
      const valueToGet = ethers.utils.parseEther('1');

      //deploy make and deploy contract
      const Escrow = await ethers.getContractFactory('Escrow');
      const thisContract = await Escrow.deploy(
        arbiter.getAddress(),
        [beneficiary.getAddress(), beneficiary2.getAddress(), beneficiary3.getAddress()],
        {
          value: valueToSend,
        }
      );
      await thisContract.deployed();
  
      //get balances
      const before1 = await ethers.provider.getBalance(beneficiary.getAddress());
      const before2 = await ethers.provider.getBalance(beneficiary2.getAddress());
      const before3 = await ethers.provider.getBalance(beneficiary3.getAddress());

      //approve
      const approveTxn = await thisContract.connect(arbiter).approve();
      await approveTxn.wait();
      
      //get balances
      const after1 = await ethers.provider.getBalance(beneficiary.getAddress());
      const after2 = await ethers.provider.getBalance(beneficiary2.getAddress());
      const after3 = await ethers.provider.getBalance(beneficiary3.getAddress());

      //make sure correct
      expect(after1.sub(before1)).to.eq(valueToGet);
      expect(after2.sub(before2)).to.eq(valueToGet);
      expect(after3.sub(before3)).to.eq(valueToGet);
    });
  });
});
