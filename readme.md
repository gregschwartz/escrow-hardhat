# esCROW

A bit frustrated with how much of this course is front-end development (and thus learning React and quite a few other tools) rather than the purpose of course: **Solidity!** That said, I decided to go for a pun with the name and theme.

# How you achieved the goals of the project

Express.js tutorials ended up being far too complex, but Chad suggested I adapt Project 1's simple backend. 

I ran into quite a few problems with Tailwind causing hard to debug problems; it seems both useful and overly complicating. Particularly in that it seems to push you to apply classes (e.g. styling) to things over and over again, instead of doing some CSS like `p strong { color: green }`.

I enjoyed the challenge to add and test new features for Escrow.sol -- it reminds me of how satisfying I find unit testing. I added:

1. `cancel()` method. It refunds the amount to the depositor, and can only be called by the arbiter.
2. Multiple (1+) beneficiaries, with funds split between them. Although I didn't limit the number of beneficiaries in the contract, my UI shows exactly 3 beneficiary fields (#1 required, #2 and #3 optional). I didn't want to have to build out add/remove actions to support an arbitrary number of beneficiaries. That's an obvious next step improvement, though.
3. Contract fails to deploy if no value is passed to it.

## Project Layout

There are three top-level folders:

1. `/app` - contains the front-end application
2. `/contracts` - contains the solidity contract
3. `/tests` - contains tests for the solidity contract
4. `/server` - simple server to save contracts

## Setup

1. Install dependencies and start hardhat: in the top-level directory run `npm install; npx hardhat node`.
2. In another terminal: `cd server; npm i; node index`
3. In another terminal: `cd app; npm install; npm start`
4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Testing the Contract

Run `npx hardhat test` to execute the unit tests on the contract.

## Deploy to Goerli

It is deployed to [https://goerli.etherscan.io/address/0x790194945d0d9f4d1f5943D06c7cdbB38236424e](Goerli address 0xcaFAa9C9662f2a7EaeceD891C039317035286540).

But in case I need it later, here's my notes on how I did it:

1. `touch .env`
2. Put two things into .env: `TEST_URL` and `TEST_PRIVATE_KEY`
3. `npx hardhat run scripts/deploy.js --network goerli`
