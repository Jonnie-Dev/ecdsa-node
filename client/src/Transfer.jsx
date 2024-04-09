import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak.js";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      // transaction details
      const transaction = {
        sender: address,
        recipient,
        amount: parseInt(sendAmount),
        nonce: Date.now(),
      };

      // Hash the message
      const data = JSON.stringify(transaction);
      const hash = keccak256(utf8ToBytes(data));

      const senderPrivateKey = privateKey;
      const signature = secp256k1.sign(hash, senderPrivateKey);
      const pkHonest = signature.recoverPublicKey(hash).toRawBytes();

      const isSigned = secp256k1.verify(signature, hash, pkHonest);

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        isSigned,
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      // alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
