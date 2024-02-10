import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [ownerAddress, setOwnerAddress] = useState(""); // Default empty owner address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Contract address
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      // Once wallet is set, get a reference to the deployed contract
      getATMContract();
    }
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
    getBalance();
  };

  const getBalance = async () => {
    if (atm) {
      const newBalance = await atm.getBalance();
      setBalance(newBalance.toNumber());
    }
  };

  const deposit = async () => {
    try {
      // Verify the entered owner address
      if (ownerAddress.toLowerCase() !== "0x5FbDB2315678afecb367f032d93F642f64180aa3".toLowerCase()) {
        throw new Error("You are not authorized to use this ATM");
      }

      const tx = await atm.deposit(1, { from: account }); // Pass sender address
      await tx.wait();
      getBalance();
      // Print digital receipt
      alert(Transaction Successful!\n\nOwner Address: ${ownerAddress}\nAccount: ${account}\nTransaction Type: Deposit\nAmount: 1 ETH);
    } catch (error) {
      console.error("Error depositing:", error);
      alert("Error depositing: " + error.message);
    }
  };

  const withdraw = async () => {
    try {
      // Verify the entered owner address
      if (ownerAddress.toLowerCase() !== "0x5FbDB2315678afecb367f032d93F642f64180aa3".toLowerCase()) {
        throw new Error("You are not authorized to use this ATM");
      }

      const tx = await atm.withdraw(1, { from: account }); // Pass sender address
      await tx.wait();
      getBalance();
      // Print digital receipt
      alert(Transaction Successful!\n\nOwner Address: ${ownerAddress}\nAccount: ${account}\nTransaction Type: Withdrawal\nAmount: 1 ETH);
    } catch (error) {
      console.error("Error withdrawing:", error);
      alert("Error withdrawing: " + error.message);
    }
  };

  const disconnectAccountManually = () => {
    alert("To disconnect your MetaMask account manually, follow these steps:\n\n1. Click on the MetaMask extension icon in the browser toolbar.\n2. Click on the account icon at the top-right corner.\n3. Scroll down to the bottom of the menu and click on 'Settings'.\n4. In the Settings menu, scroll down to the 'Advanced' section.\n5. Click on 'Connected Sites'.\n6. Find your site in the list of connected sites and click on the three dots icon next to it.\n7. Select 'Forget this site' from the dropdown menu.");
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {account ? (
        <div>
          <p>Your Account: {account}</p>
          <p>Your Balance: {balance}</p>
          <p>Please enter owner address to make a successful transaction:</p>
          <input
            type="text"
            placeholder="Enter owner address"
            value={ownerAddress}
            onChange={(e) => setOwnerAddress(e.target.value)}
          />
          <button onClick={deposit}>Deposit 1 ETH</button>
          <button onClick={withdraw}>Withdraw 1 ETH</button>
          <button onClick={disconnectAccountManually}>Disconnect Account (Manual)</button>
        </div>
      ) : (
        <button onClick={connectAccount}>Connect your MetaMask wallet</button>
      )}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
