import React from "react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  return (
    <div className="p-6">
      
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Blockchain Supply Chain Tracker</h1>
        <p className="text-lg mb-6">
          Track your products with blockchain-powered transparency, QR scanning, and live location updates.
        </p>
        <Link
          to="/add"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow hover:bg-gray-200"
        >
          Add New Product
        </Link>
      </div>

     
  <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link
          to="/transfer"
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-semibold mb-3">🔄 Transfer Product</h2>
          <p>Transfer product ownership to another wallet address.</p>
        </Link>
        <Link
          to="/grant-role"
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-semibold mb-3">🔑 Grant Role</h2>
          <p>Grant blockchain roles (Manufacturer, Retailer, etc) to any wallet address.</p>
        </Link>

        <Link
          to="/track"
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-semibold mb-3">📍 Live Location</h2>
          <p>Track the real-time location of your product in transit.</p>
        </Link>

        <Link
          to="/verify"
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-semibold mb-3">✅ Verify Delivery</h2>
          <p>Confirm delivery and mark products as received.</p>
        </Link>
      </div>
    </div>
  );
}
