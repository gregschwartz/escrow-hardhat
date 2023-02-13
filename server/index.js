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
  console.log("Got ", storage.length," contracts from storage", storage);
  res.send( storage );
});

app.post("/save", (req, res) => {
  const { address,
    depositor,
    arbiter,
    beneficiaries,
    value,
    status
  } = req.body;
  
  const data = {
    address: address,
    depositor: depositor,
    arbiter: arbiter,
    beneficiaries: beneficiaries,
    value: value, 
    status: status
  };

  storage.push(data);
  console.log("Stored", data);

  res.send({ saved: true, numStored: storage.length });
});

app.post("/update", (req, res) => {
  const { address, status } = req.body;

  var updated = false;
  for(var i=0; i<storage.length; i++) {
    if(storage[i].address === address) {
      storage[i].status = status;
      updated = true;
      console.log("Updated", address, "with", status);
    }
  }
  
  res.send({ updated: updated, numStored: storage.length });
});
  

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

