import { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/Supplychain.json";
import { QRCodeCanvas } from "qrcode.react";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const AddProduct: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [productId, setProductId] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    setError("");
    if (!window.ethereum) {
      setError("Please install MetaMask");
      return;
    }
    if (!name || !description) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

      
      const metadataObj = {
        name,
        description,
        
      };
      const metadata = JSON.stringify(metadataObj);
      const tokenuri = `data:application/json;base64,${btoa(metadata)}`;
      const qrData = `Product:${name}-${Date.now()}`;
      const tx = await contract.createproduct(metadata, tokenuri, qrData);
      const receipt = await tx.wait();

      
      let newProductId = null;
      if (receipt && receipt.logs) {
        for (const log of receipt.logs) {
          try {
            const parsed = contract.interface.parseLog(log);
            if (parsed && parsed.name === "ProductCreated") {
              newProductId = parsed.args.productId.toString();
              break;
            }
          } catch {}
        }
      }
      if (newProductId !== null) {
        setProductId(Number(newProductId));
      } else {
        setError("Product created but could not fetch Product ID.");
      }
      setName("");
      setDescription("");
    } catch (err: any) {
      setError(err?.reason || err?.message || "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register Product (Manufacturer Only)</h1>

      <div className="mb-4 text-gray-600 text-sm">
        <ul className="list-disc ml-6">
          <li>Fill in product details below. All fields are required.</li>
          <li>Name: Short name of the product.</li>
          <li>Description: Brief description of the product.</li>
        </ul>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-2 mb-2 rounded">{error}</div>}

      <input
        type="text"
        placeholder="Product Name (e.g. 'Sample Product 001')"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded p-2 mb-2"
        title="Short name of the product."
      />
      <textarea
        placeholder="Product Description (e.g. 'A demo product for testing.')"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded p-2 mb-4"
        title="Brief description of the product."
        rows={3}
      />

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => {
            setName("Sample Product 001");
            setDescription("A demo product for testing.");
          }}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
        >
          Autofill Demo Data
        </button>
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded flex-1"
        >
          {loading ? "Registering..." : "Register Product"}
        </button>
      </div>

      {productId !== null && (
        <div className="mt-6 text-center">
          <h2 className="text-lg font-semibold text-green-700">Product Registered!</h2>
          <p className="mb-2">Product ID: <span className="font-mono">{productId}</span></p>
          <QRCodeCanvas value={String(productId)} size={200} />
          <div className="mt-2">
            <span className="text-gray-600">Scan this QR code to track or verify the product.</span>
          </div>
        </div>
      )}
    </div>
  );
}
