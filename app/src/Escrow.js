import { ethers } from 'ethers';

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> <abbr title={arbiter}>{arbiter.substring(0,7)}...</abbr> </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> <abbr title={beneficiary}>{beneficiary.substring(0,7)}...</abbr> </div>
        </li>
        <li>
          <div> Value </div>
          <div> {ethers.utils.formatEther(value)} </div>
        </li>
        <input 
          type="button" 
          id="deploy"
          onClick={(e) => {
            e.preventDefault();
            
            handleApprove();
          }}
          value='Approve'
        />
        
      </ul>
    </div>
  );
}
