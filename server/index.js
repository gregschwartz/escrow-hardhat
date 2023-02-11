const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { sha256 } = require("ethereum-cryptography/sha256");
const { hexToBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

//storing the contracts 
const storage = [];

app.get("/contracts", (req, res) => {
  console.log("Got contracts from storage");
  res.send( storage );
});

app.post("/save", (req, res) => {
  const { address,
    arbiter,
    beneficiary,
    value } = req.body;

  storage.push({
    address: address,
    arbiter: arbiter,
    beneficiary: beneficiary,
    value: value 
  });

  console.log("Stored a contract");
  res.send({ saved: true, numStored: storage.length });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

