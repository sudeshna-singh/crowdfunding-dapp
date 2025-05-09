// src/components/Navbar.tsx
"use client";
import React from "react";
import Link from "next/link";
import { useBlockchain } from "../context/BlockchainContext";
import { shortenAddress } from "../utils/formatters";

const Navbar = () => {
  const { currentAccount, connectWallet } = useBlockchain();

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        CrowdFunding DApp
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/" className="text-gray-700 hover:text-blue-600">
         All Campaigns
        </Link>
        
        {/* Add Your Campaigns link */}
        <Link href="/your-campaigns" className="text-gray-700 hover:text-blue-600">
          Your Campaigns
        </Link>
        
        <Link href="/create-campaign" className="text-gray-700 hover:text-blue-600">
          Create Campaign
        </Link>

        {!currentAccount ? (
          <button
            onClick={connectWallet}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        ) : (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
            {shortenAddress(currentAccount)}
          </span>
        )}
      </div>
    </div>
  );
};

export default Navbar;

