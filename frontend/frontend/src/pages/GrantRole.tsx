import { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/Supplychain.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const ROLES = [
  { label: "Manufacturer", value: "Manufactor_role" },
  { label: "Retailer", value: "Retailer_role" },
  { label: "Transporter", value: "Transporter_role" },
  { label: "Warehouse", value: "Warehouse_role" },
  { label: "Consumer", value: "Consumer_role" },
];

export const GrantRole: React.FC = () => {
  const [wallet, setWallet] = useState("");
  const [role, setRole] = useState(ROLES[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGrant = async () => {
    setError("");
    setSuccess("");
    if (!window.ethereum) {
      setError("Please install MetaMask");
      return;
    }
    if (!wallet) {
      setError("Please enter a wallet address");
      return;
    }
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
      const roleHash = await contract[role]();
      const tx = await contract.grantRole(roleHash, wallet);
      await tx.wait();
      setSuccess(`Role granted successfully to ${wallet}`);
      setWallet("");
    } catch (err: any) {
      setError(err?.reason || err?.message || "Error granting role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Grant Role to Wallet</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-2 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 mb-2 rounded">{success}</div>}
      <input
        type="text"
        placeholder="Wallet Address"
        value={wallet}
        onChange={e => setWallet(e.target.value)}
        className="w-full border rounded p-2 mb-2"
      />
      <select
        value={role}
        onChange={e => setRole(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        {ROLES.map(r => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
      <button
        onClick={handleGrant}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Granting..." : "Grant Role"}
      </button>
    </div>
  );
};

export default GrantRole;
