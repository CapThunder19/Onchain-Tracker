
# Onchain Supply Chain Tracker

A full-stack blockchain supply chain tracker using Solidity, Hardhat, React, ethers.js, wagmi, and Vite. Track products as NFTs, update their location, transfer ownership, and verify delivery—all on-chain, with QR code and map integration.

## Features
- Register products as NFTs with name, description, and QR code
- Assign supply chain roles (Manufacturer, Retailer, Transporter, Warehouse, Consumer)
- Transfer product ownership and update location
- Track product details and location history (with map visualization)
- Scan and verify products via QR code
- Grant roles to wallet addresses (admin only)
- All actions recorded on-chain for transparency

## Tech Stack
- Solidity (Smart Contract)
- Hardhat (Development & Deployment)
- React + Vite (Frontend)
- ethers.js, wagmi (Blockchain interaction)
- react-qr-reader, qrcode.react (QR code features)
- react-leaflet, leaflet (Map visualization)


###  Usage
- **Grant Role:** Admin assigns roles to wallet addresses.
- **Add Product:** Manufacturer registers a product (name, description).
- **Transfer Product:** Transfer ownership and update location.
- **Track Product:** View product details and location history (with map).
- **Verify Product:** Consumer scans QR code and verifies delivery.

## Demo Data
Use the "Autofill Demo Data" button on Add Product page for quick testing.


## License
MIT

## Authors
- Your Name Anirudh

---
For questions or contributions, open an issue or pull request!
