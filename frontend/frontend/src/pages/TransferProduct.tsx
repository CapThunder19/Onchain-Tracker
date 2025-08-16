import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/Supplychain.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const TransferProduct: React.FC = () => {
  const [productId, setProductId] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleTransfer = async () => {
    setStatus("");
    if (!window.ethereum) {
      setStatus("Please install MetaMask");
      return;
    }
    if (!productId || !newOwner || !latitude || !longitude) {
      setStatus("Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
      
      
      const tx1 = await contract.transferownership(Number(productId), newOwner);
      await tx1.wait();
      

      const tx2 = await contract.updateloction(Number(productId), Number(latitude), Number(longitude));
      await tx2.wait();
      setStatus("✅ Product ownership transferred and location updated!");
      setProductId("");
      setNewOwner("");
      setLatitude("");
      setLongitude("");
    } catch (err: any) {
      setStatus(err?.reason || err?.message || "Error transferring product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transfer Product Ownership</h1>
      {status && <div className="mb-2 text-blue-700">{status}</div>}
      <input
        type="text"
        placeholder="Product ID"
        value={productId}
        onChange={e => setProductId(e.target.value)}
        className="w-full border rounded p-2 mb-2"
      />
      <input
        type="text"
        placeholder="New Owner Wallet Address"
        value={newOwner}
        onChange={e => setNewOwner(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />
      <input
        type="number"
        placeholder="Latitude"
        value={latitude}
        onChange={e => setLatitude(e.target.value)}
        className="w-full border rounded p-2 mb-2"
      />
      <input
        type="number"
        placeholder="Longitude"
        value={longitude}
        onChange={e => setLongitude(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />
      <button
        onClick={handleTransfer}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Transferring..." : "Transfer Ownership & Update Location"}
      </button>
    </div>
  );
};

export default TransferProduct;
