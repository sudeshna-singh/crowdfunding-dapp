"use client";
import React from "react";
import CreateCampaignForm from "../../components/CreateCampaignForm";
import { useBlockchain } from "../../context/BlockchainContext";
import Link from "next/link";

export default function CreateCampaign() {
  const { currentAccount } = useBlockchain();

  if (!currentAccount) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Connect Your Wallet</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          You need to connect your wallet to create a crowdfunding campaign.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create a New Campaign</h1>
      <CreateCampaignForm />
    </div>
  );
}
