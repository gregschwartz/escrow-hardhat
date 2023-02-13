import { ethers } from 'ethers';

export default function Escrow({
  address,
  depositor,
  arbiter,
  beneficiaries,
  value,
  status,
  handleApprove,
  handleCancel
}) {
  return (
    <div className="existing-contract" id={address} name={address}>
      <ul className="fields p-2">
        <li>
          <div> Depositor </div>
          <div> {depositor} </div>
        </li>
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiaries </div>
          <div> {beneficiaries ? beneficiaries.join(', ') : ""} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {ethers.utils.formatEther(value)} </div>
        </li>
        <li style={{display: (status === "Ready" ? "none" : "") }}>
          <div>Status </div>
          <div>{status} </div>
        </li>
        <li className='actions container flex flex-row' style={{display: (status !== "Ready" ? "none" : "") }}>

          <div className='w-1/3 '>
            <input 
              type="button" 
              id="deploy"
              className='h-2/3'
              onClick={(e) => {
                e.preventDefault();
                
                handleApprove();
              }}
              value='Approve'
            />
          </div>
          <div className='w-2/3 flex'>
            <input 
              type="button" 
              id="cancel"
              className='h-2/3'
              onClick={(e) => {
                e.preventDefault();
                
                handleCancel();
              }}
              value='Cancel'
            />
          </div>
        </li>
        
      </ul>
    </div>
  );
}
