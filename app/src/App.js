import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import loadContract from './loadContract';
import Escrow from './Escrow';
import server from "./server";
import * as Scroll from 'react-scroll';

const provider = new ethers.providers.Web3Provider(window.ethereum);

//error checking and en/disable deploy button for new Escrow contract
function setButtonEnabled() {
  var enabled = true;
  try {
    ethers.utils.getAddress(document.getElementById('arbiter').value);
    
    ethers.utils.getAddress(document.getElementById('beneficiary1').value);

    if(document.getElementById('beneficiary2').value.length > 0) {
      ethers.utils.getAddress(document.getElementById('beneficiary2').value);
    }

    if(document.getElementById('beneficiary3').value.length > 0) {
      ethers.utils.getAddress(document.getElementById('beneficiary3').value);
    }
  } catch (x) {
    enabled = false;
  }

  //valid value of ETH
  enabled = enabled && document.getElementById('etherValue').value > 0;

  document.getElementById('deploy').disabled = !enabled;
  document.getElementById('deploy').value = (enabled ? "Deploy" : "Missing Info");
  document.getElementById('deploy').className = (enabled ? "animate-bounce" : "");
}
setTimeout(setButtonEnabled, 300);
setTimeout(setButtonEnabled, 500);

//called by clicking on Approve and Cancel buttons
async function handleContractAction(escrowContract, signer, newStatus, prettyText) {
  if(await signer.getAddress() !== await escrowContract.arbiter()) {
    alert("You aren't the arbiter, you cannot act on the contract!");
    return;
  }

  escrowContract.on(newStatus, async () => {
    const {
      data: { updated, numStored },
    } = await server.post(`update`, {
      address: escrowContract.address,
      status: newStatus
    });
    console.log("updated", updated, "numStored", numStored);

    if(!updated) {
      alert("contract "+newStatus+" but backend couldn't be updated to store that?!"); 
      return;
    }

    escrowContract.status = newStatus;
    
    const wrapper = document.getElementById(escrowContract.address).getElementsByClassName("actions")[0];
    wrapper.innerText = prettyText;
  });

  let txn;
  try {

    if(newStatus === "Approved") {
      txn = await escrowContract.connect(signer).approve();
    } else {
      txn = await escrowContract.connect(signer).cancel();
    }
    await txn.wait();
  } catch (ex) {
    const nonceMatch = ex.message.match(/Expected nonce to be ([0-9]+) but got/);
    if(nonceMatch) {
      alert("Nonce Mismatch! Please override it to be: "+ nonceMatch[1]);
    }
  }
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [balance, setBalance] = useState();
  const [balanceWhole, setBalanceWhole] = useState();
  const [balanceDecimal, setBalanceDecimal] = useState();

  const initialContractStatus = "Ready";

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      //need these if statements so it doesn't create a loop of setting them, then running useEffect again because they were set. Which can happen because I'm both setting, and using, signer. Which apparently then means I have to have signer be in the params that cause useEffect to be called. (WHY?!)
      if(account === undefined) { setAccount(accounts[0]); }
      if(signer === undefined) { setSigner(await provider.getSigner()); }

      const bal = await provider.getBalance(accounts[0]);

      setBalance(ethers.utils.formatEther(bal));
      setBalanceWhole(Math.floor(ethers.utils.formatEther(bal)));
      setBalanceDecimal((ethers.utils.formatEther(bal) %1).toString().substring(2,6));

      //load contracts from backend
      const {
        "data": existingContracts
      } = await server.get(`/contracts`);
      if(existingContracts && existingContracts.length > 0) {
        for(var i=0; i<existingContracts.length; i++) {
          const escrowContract = await loadContract(existingContracts[i].address, signer);

          existingContracts[i]["handleApprove"] = async () => {
            await handleContractAction(escrowContract, signer, "Approved", "✓ It's been approved!");
          };

          existingContracts[i]["handleCancel"] = async () => {
            await handleContractAction(escrowContract, signer, "Cancelled", "X It's been cancelled!");
          };
        }
        setEscrows(existingContracts);
      }
    }

    getAccounts();
  }, [account, signer]);

  async function newContract() {
    const beneficiaries = [document.getElementById('beneficiary1').value];
    const beneficiary2 = document.getElementById('beneficiary2').value;
    const beneficiary3 = document.getElementById('beneficiary3').value;

    if(beneficiary2) { beneficiaries.push(beneficiary2); }
    if(beneficiary3) { beneficiaries.push(beneficiary3); }

    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.utils.parseEther(document.getElementById('etherValue').value);

    let escrowContract;
    try {
      escrowContract = await deploy(signer, arbiter, beneficiaries, value);
    } catch (ex) {
      const nonceMatch = ex.message.match(/Expected nonce to be ([0-9]+) but got/);
      if(nonceMatch) {
        alert("Nonce Mismatch! Please override it to be: "+ nonceMatch[1]);
      }
      return;
    }

    const escrow = {
      address: escrowContract.address,
      depositor: await signer.getAddress(),
      arbiter,
      beneficiaries: beneficiaries,
      value: value.toString(),
      status: initialContractStatus,
      handleApprove: async () => {
        await handleContractAction(escrowContract, signer, "Approved", "✓ It's been approved!");
      },
      handleCancel: async () => {
        await handleContractAction(escrowContract, signer, "Cancelled", "X It's been cancelled!");
      },
    };

    //save to in-browser memory
    setEscrows([...escrows, escrow]);

    //save to backend
    try {
      const {
        data: { saved, numStored },
      } = await server.post(`save`, escrow);
      console.log("saved", saved, "numStored", numStored);
    } catch (ex) {
      alert(ex.response.data.message);
    }

    //scroll to newly created EscrowContract
    Scroll.scroller.scrollTo(escrowContract.address, {
      duration: 500,
      delay: 100,
      smooth: true
    });
  }

  return (
    <>
      <div className='container px-4 flex flex-row'>
        <div className='balance w-1/6 text-center'>
          <h3>Your ETH Balance</h3>
          <abbr title={balance}>{balanceWhole}<span className='text-slate-400'>.{balanceDecimal}</span ></abbr>
        </div>
        <div className="contract w-5/6">
          <h3> New Escrow </h3>
          <label>
            Ether
            <input type="text" id="etherValue" onChange={setButtonEnabled} placeholder="Amount to send" />
          </label>

          <label>
            Arbiter Address
            <input type="text" id="arbiter" onChange={setButtonEnabled}placeholder="0xDEAD..." />
          </label>

          <label>
            Beneficiary #1 Address
            <input type="text" id="beneficiary1" onChange={setButtonEnabled}placeholder="0xBEEF..." />
          </label>

          <label>
            Beneficiary #2 Address <em>(optional)</em>
            <input type="text" id="beneficiary2" onChange={setButtonEnabled}placeholder="0xABCD..." />
          </label>

          <label>
            Beneficiary #3 Address <em>(optional)</em>
            <input type="text" id="beneficiary3" onChange={setButtonEnabled}placeholder="0x1234..." />
          </label>

          <input 
            type="button" 
            id="deploy"
            onClick={(e) => {
              e.preventDefault();
              newContract();
            }}
            value='Deploy'
          />
        </div>
      </div>

      <div className='container px-4 flex flex-row'>
        <div className="existing-contracts w-full	">
          <h3> Existing Escrows </h3>

          <div id="container">
            {escrows.map((escrow) => {
              return <Escrow key={escrow.address} {...escrow} />;
            })}
            {escrows.length === 0 && <p className="text-center"><em>No previous transactions</em></p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
