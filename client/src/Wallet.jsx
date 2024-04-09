import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const address = toHex(keccak256(secp256k1.getPublicKey(privateKey)));

    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type a private key, for example: 0x1"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div>Address: 0x{address.slice(0, 16)}...</div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
