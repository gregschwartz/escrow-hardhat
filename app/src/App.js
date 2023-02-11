import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function validateAddress(event) {
  const field = event.target;
  var good = true;
  try {
    ethers.utils.getAddress(field.value);
  } catch (x) {
    good = false;
  }

  if (good) {
    field.classList.remove("error");
  } else {
    field.classList.add("error");
  }
  console.log('classlist', field.classList);
}

function setButtonEnabled() {
  var enabled = true;
  try {
    ethers.utils.getAddress(document.getElementById('beneficiary').value);
    ethers.utils.getAddress(document.getElementById('arbiter').value);
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

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [balance, setBalance] = useState();
  const [balanceWhole, setBalanceWhole] = useState();
  const [balanceDecimal, setBalanceDecimal] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());

      // console.log("account", );
      const bal = await provider.getBalance(accounts[0]);

      setBalance(ethers.utils.formatEther(bal));
      setBalanceWhole(Math.floor(ethers.utils.formatEther(bal)));
      setBalanceDecimal((ethers.utils.formatEther(bal) %1).toString().substring(2,8));
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.utils.parseEther(document.getElementById('etherValue').value);
    console.log("deploy:",signer, arbiter, value);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);


    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className='container px-4 flex flex-row'>
        <div className='balance w-1/6 text-center'>
          <h3>Your ETH Balance</h3>
          <abbr className='balance' title={balance}>{balanceWhole}<span className='text-slate-400'>.{balanceDecimal}</span ></abbr>
        </div>
        <div className="contract w-5/6">
          <h3> New Escrow </h3>
          <label>
            Arbiter Address
            <input type="text" className='' id="arbiter" onChange={setButtonEnabled} onBlur={validateAddress} placeholder="0xDEAD..." />
          </label>

          <label>
            Beneficiary Address
            <input type="text" className='' id="beneficiary" onChange={setButtonEnabled} onBlur={validateAddress} placeholder="0xBEEF..." />
          </label>

          <label>
            Ether
            <input type="text" id="etherValue" onChange={setButtonEnabled} placeholder="Amount to send" />
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
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
