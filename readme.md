# esCROW

A bit frustrated with how much of this course is front-end development (and thus learning React and quite a few other tools) rather than the purpose of course: **Solidity!** That said, I decided to go for a pun with the name and theme.

# How you achieved the goals of the project

Express.js tutorials ended up being far too complex, but a mentor reminded me that project 1 had a simple backend, so I adapted that. Also ran into quite a few problems with Tailwind causing hard to debug problems; it seems both useful and overly complicating. Particularly in that it seems to push you to apply classes (e.g. styling) to things over and over again, instead of doing some CSS like `p strong { color: green }`.

The challenge to add 2 new features to Escrow.sol, and test them, was fun. I decided to explore multiple depositors and multiple beneficiaries, rather than multiple arbiters the way other students did. It was pleasantly easy to do in the contract.

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

## Deploy to Goerli

It is deployed to [https://goerli.etherscan.io/address/0x790194945d0d9f4d1f5943D06c7cdbB38236424e](Goerli address 0xcaFAa9C9662f2a7EaeceD891C039317035286540).

But in case I need it later, here's my notes on how I did it:

1. `touch .env`
2. Put two things into .env: `TEST_URL` and `TEST_PRIVATE_KEY`
3. `npx hardhat run scripts/deploy.js --network goerli`
