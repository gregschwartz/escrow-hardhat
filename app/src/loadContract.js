import { ethers } from 'ethers';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';

export default async function loadContract(address, signer) {
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );
  return factory.attach(address);
}
