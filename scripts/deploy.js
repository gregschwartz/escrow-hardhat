async function main() {
  const arbiter = "0xaDD95228501c0769b1047975faf93FC798C4E76C"; //Adrian 
  const beneficiaries = ["0x636D0fD59463464D4635d98408d9Fe07096a2452", "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec"]; //Oscar and Bapic
  const amount = "200000000000000000";

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(arbiter, beneficiaries, {value: amount });
  console.log(`Escrow contract ready!`);
  console.log(`\t Sending ${amount} wei`);
  console.log(`\t Arbitrated by ${arbiter}`);
  console.log(`\t Beneficiaries ${beneficiaries}`);
  console.log(`\t Deployed to address: https://goerli.etherscan.io/address/${escrow.address} `);
}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });
