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

  describe('after approval from address other than the arbiter', () => {
    it('should revert', async () => {
      await expect(contract.connect(beneficiary).approve()).to.be.reverted;
    });
  });

  describe('amount should increase with multiple depositors', async () => {
    it('should be 2ETH after 2 depositors', async () => {
      const otherSigner = ethers.provider.getSigner(3);
      response = await contract.connect(otherSigner).deposit({ value: deposit });

      let balance2 = await ethers.provider.getBalance(contract.address);
      expect(balance2).to.eq(ethers.utils.parseEther('2'));
    });

    it('should be 3ETH after 3 depositors', async () => {
      const otherSigner = ethers.provider.getSigner(3);
      response = await contract.connect(otherSigner).deposit({ value: deposit });

      const anotherSigner = ethers.provider.getSigner(4);
      response = await contract.connect(anotherSigner).deposit({ value: deposit });

      let balance2 = await ethers.provider.getBalance(contract.address);
      expect(balance2).to.eq(ethers.utils.parseEther('3'));
    });
  });

  describe('1 beneficiary: after approval from the arbiter', () => {
    it('should transfer balance', async () => {
      const before = await ethers.provider.getBalance(beneficiary.getAddress());
      const approveTxn = await contract.connect(arbiter).approve();
      await approveTxn.wait();
      const after = await ethers.provider.getBalance(beneficiary.getAddress());
      expect(after.sub(before)).to.eq(deposit);
    });
  });

  describe('2 beneficiaries: after approval from the arbiter', () => {
    it('should transfer balance', async () => {
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
    it('should transfer balance', async () => {
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
