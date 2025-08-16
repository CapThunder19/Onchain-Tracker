
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useReadContract } from "wagmi";
import supplychainAbi from "../abi/Supplychain.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

type ProductDetails = {
  id: bigint;
  metadata: string;
  qrCode: string;
  currentOwner: string;
  trustscore: bigint;
  verified: boolean;
};

export const TrackProduct: React.FC = () => {
  const [productId, setProductId] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  
  const { data: productDetailsRaw, refetch: refetchDetails, isLoading: loadingDetails, error: errorDetails } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: supplychainAbi.abi,
    functionName: "getproductdetails",
    args: productId ? [BigInt(productId)] : undefined,
    
  });

  const productDetails = productDetailsRaw as ProductDetails | undefined;

 
  type LocationHistoryItem = {
    latitude: bigint;
    longitude: bigint;
    timestamp: bigint;
    updatedBy: string;
  };

  
  const { data: locationHistoryRaw, refetch: refetchLocations, isLoading: loadingLocations, error: errorLocations } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: supplychainAbi.abi,
    functionName: "getProductLocationHistory",
    args: productId ? [BigInt(productId)] : undefined,
   
  });

  const locationHistory = locationHistoryRaw as LocationHistoryItem[] | undefined;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDetails(true);
    refetchDetails();
    refetchLocations();
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Track Product</h1>
      <form onSubmit={handleTrack} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          disabled={loadingDetails || loadingLocations}
        >
          {loadingDetails ? "Loading..." : "Track"}
        </button>
      </form>

      {errorDetails && <p className="text-red-500">Error: {errorDetails.message}</p>}

      {productDetails && (
        <div className="mb-4 border p-4 rounded bg-gray-50">
          <h2 className="font-semibold">Product Details</h2>
          <p><b>ID:</b> {productDetails.id?.toString()}</p>
          <p><b>Metadata:</b> {productDetails.metadata}</p>
          <p><b>QR Code:</b> {productDetails.qrCode}</p>
          <p><b>Current Owner:</b> {productDetails.currentOwner}</p>
          <p><b>Trust Score:</b> {productDetails.trustscore?.toString()}</p>
          <p><b>Verified:</b> {productDetails.verified ? "Yes" : "No"}</p>
        </div>
      )}

      {loadingLocations && <p>Loading location history...</p>}
      {errorLocations && <p className="text-red-500">Error: {errorLocations.message}</p>}
      {locationHistory && Array.isArray(locationHistory) && locationHistory.length > 0 && (
        <div className="border p-4 rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Location History</h2>
          <ul className="space-y-2 mb-4">
            {locationHistory.map((loc: any, idx: number) => (
              <li key={idx} className="border-b pb-2">
                <b>Lat:</b> {loc.latitude?.toString?.()} | <b>Long:</b> {loc.longitude?.toString?.()}<br />
                <b>Timestamp:</b> {loc.timestamp?.toString?.()}<br />
                <b>Updated By:</b> {loc.updatedBy}
              </li>
            ))}
          </ul>
          
          
          <div style={{ height: "300px", width: "100%" }}>
            <MapContainer
              key={productId + '-' + (locationHistory[0]?.timestamp?.toString() || '')}
              center={[
                Number(locationHistory[0].latitude) / 1e6 || 0,
                Number(locationHistory[0].longitude) / 1e6 || 0
              ]}
              zoom={5}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {locationHistory.map((loc: any, idx: number) => (
                <Marker
                  key={idx}
                  position={[
                    Number(loc.latitude) / 1e6,
                    Number(loc.longitude) / 1e6
                  ]}
                >
                  <Popup>
                    <div>
                      <b>Lat:</b> {Number(loc.latitude) / 1e6}<br />
                      <b>Long:</b> {Number(loc.longitude) / 1e6}<br />
                      <b>Updated By:</b> {loc.updatedBy}
                    </div>
                  </Popup>
                </Marker>
              ))}
              <Polyline
                positions={locationHistory.map((loc: any) => [
                  Number(loc.latitude) / 1e6,
                  Number(loc.longitude) / 1e6
                ])}
                color="blue"
              />
            </MapContainer>
          </div>
        </div>
      )}
      {locationHistory && Array.isArray(locationHistory) && locationHistory.length === 0 && showDetails && (
        <p>No location history found for this product.</p>
      )}
    </div>
  );
}
