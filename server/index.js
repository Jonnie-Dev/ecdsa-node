const express = require("express");

const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "016d6cb3ca0322f340d1a0e0e87f1891df07d7db9287fb342777fdd98c3e74f1": 100,
  "503ce4fc285be1ab1cff9713c833745d99e22b99fcca862754c50c3216f0fbe3": 50,
  f92975cdd4a0b41b52e4a05b9df55a237e0a88e3f334fba3658cdedb7bcdfec4: 75,
};

// private key: 813c5091b8378f6c40f801b6182df74148b448bda3f97bf388be73f0f872d1f6
// public key: 016d6cb3ca0322f340d1a0e0e87f1891df07d7db9287fb342777fdd98c3e74f1

// private key: 3e71ba67b4a7445a20358a8314c7b83bbf97def15ac985f4751cf594def6afa5
// public key: 503ce4fc285be1ab1cff9713c833745d99e22b99fcca862754c50c3216f0fbe3

// private key: 99ce7970df9da930ec53cf364e083c9737d0bf127dbe521280f4d18848e1ce0c
// public key: f92975cdd4a0b41b52e4a05b9df55a237e0a88e3f334fba3658cdedb7bcdfec4

app.get("/balance/:address", (req, res) => {
  // get a signature from the client side application
  // recover the public address from the signature
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, amount, recipient, isSigned } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (!isSigned) {
    res.status(400).send({ message: "Unauthorized User" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
