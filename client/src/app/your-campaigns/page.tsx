"use client";
import React from "react";
import { useBlockchain } from "../../context/BlockchainContext";
import CampaignCard from "../../components/CampaignCard";
import Link from "next/link";

export default function YourCampaigns() {
  const { getCampaigns, campaigns, currentAccount, isLoading } = useBlockchain();

  React.useEffect(() => {
    if (currentAccount) {
      getCampaigns();
    }
  }, [currentAccount, getCampaigns]);

  // Filter campaigns to only show those created by the current user
  const yourCampaigns = campaigns.filter(
    campaign => campaign.owner.toLowerCase() === currentAccount.toLowerCase()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Campaigns</h1>
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
            Connect your wallet to view your campaigns.
          </p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      ) : yourCampaigns.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">No campaigns found</h2>
          <p className="text-gray-600 mb-6">
            You haven't created any campaigns yet.
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
          {yourCampaigns.map((campaign, index) => (
            <CampaignCard
              key={index}
              campaign={campaign}
              id={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
