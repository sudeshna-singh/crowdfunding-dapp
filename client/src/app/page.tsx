"use client";
import React, { useEffect } from "react";
import { useBlockchain } from "../context/BlockchainContext";
import CampaignCard from "../components/CampaignCard";
import Link from "next/link";

export default function Home() {
  const { getCampaigns, campaigns, currentAccount, isLoading, connectWallet } = useBlockchain();

  useEffect(() => {
    const loadCampaigns = async () => {
      await getCampaigns();
    };
    loadCampaigns();
  }, [currentAccount, getCampaigns]);

  // Filter for campaigns created by the current user
  const yourCampaigns = campaigns.filter(
    c => currentAccount && c.owner.toLowerCase() === currentAccount.toLowerCase()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Active Campaigns Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Active Campaigns</h1>
        <Link
          href="/create-campaign"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Create Campaign
        </Link>
      </div>

      {!currentAccount ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to view active campaigns and start funding.
          </p>
          <button 
            onClick={connectWallet}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">No active campaigns found</h2>
          <p className="text-gray-600 mb-6">
            Be the first to create a crowdfunding campaign.
          </p>
          <Link
            href="/create-campaign"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Create Campaign
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign, index) => (
            <CampaignCard
              key={index}
              campaign={campaign}
              id={index}
            />
          ))}
        </div>
      )}

      {/* Your Campaigns Section */}
      {currentAccount && yourCampaigns.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yourCampaigns.map((campaign, index) => (
              <CampaignCard
                key={index}
                campaign={campaign}
                id={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

