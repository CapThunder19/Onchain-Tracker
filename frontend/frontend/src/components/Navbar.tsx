import type React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../config'
import { WalletConnect } from './WalletConnect'
import { Link } from 'react-router-dom'



const queryClient = new QueryClient()   

export const Navbar: React.FC = () => {
    return(
        <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
            <Link to="/" className="text-2xl font-bold text-green-400 hover:text-green-300"><h1>SupplyChainTracker</h1></Link>
            <div className="flex gap-10 flex items-center justify-between">
                <Link to="/track" className="hover:text-green-300 transition">Track Product</Link>
                <Link to="/add" className="hover:text-green-300 transition">Add Product</Link>
                <Link to="/verify" className="hover:text-green-300 transition">Verify Product</Link>
            

            <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}> 
              <WalletConnect />
            </QueryClientProvider> 
            </WagmiProvider>
            </div>
        </nav>
    )
}

