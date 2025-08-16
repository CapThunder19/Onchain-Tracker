import React, { useState } from "react";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, info: any) { console.error(error, info); }
  render() {
    if (this.state.hasError) return <div className="text-red-600">Something went wrong rendering the QR Reader.</div>;
    return this.props.children;
  }
}
import QrReader from "react-qr-reader";
import { useAccount, useWriteContract } from "wagmi";
import contractABI from "../abi/Supplychain.json";

const CONTRACT_ADDRESS = "0x7e04b7a34D9B0a6623b3780413A706B47D2D38d2";
const VerifyProduct: React.FC = () => {
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [scannedId, setScannedId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleScan = async (data: string | null) => {
    if (data) {
     
      const id = data.match(/^\d+$/) ? data : data.replace(/\D/g, "");
      setScannedId(id);
      setStatus(`Scanned Product ID: ${id}`);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    setStatus("Error scanning QR code.");
  };

  const verifyDelivery = async () => {
    if (!scannedId) return alert("Scan a product first");
    if (!isConnected) return alert("Please connect your wallet");

    try {
      setStatus("Verifying product...");
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: contractABI.abi,
        functionName: "verifyproduct", 
        args: [Number(scannedId)],
      });
      setStatus("✅ Product verified and marked as delivered!");
    } catch (error) {
      console.error(error);
      setStatus("❌ Transaction failed");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Verify Product Delivery</h1>

      {!scannedId && (
        <ErrorBoundary>
          <div style={{ width: "300px" }}>
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
          </div>
        </ErrorBoundary>
      )}

      {scannedId && (
        <div className="mt-4 text-center">
          <p>{status}</p>
          <button
            onClick={verifyDelivery}
            className="px-4 py-2 mt-2 bg-green-600 text-white rounded"
          >
            Verify Delivery
          </button>
        </div>
      )}

      <p className="mt-4 text-gray-500">{status}</p>
    </div>
  );
};

export default VerifyProduct;
