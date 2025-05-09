"use client";
import React, { useState } from "react";
import { useBlockchain } from "../context/BlockchainContext";
import { formatEther, daysLeft, shortenAddress } from "../utils/formatters";

interface Campaign {
  owner: string;
  title: string;
  description: string;
  target: bigint;
  deadline: bigint;
  amountCollected: bigint;
  donators: string[];
  donations: bigint[];
  isActive: boolean;
}

interface CampaignCardProps {
  campaign: Campaign;
  id: number;
}

const CampaignCard = ({ campaign, id }: CampaignCardProps) => {
  const { currentAccount, deleteCampaign, donate, getDonators, withdrawFunds } = useBlockchain();
  const [donationAmount, setDonationAmount] = useState("");
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showDonators, setShowDonators] = useState(false);
  const [donators, setDonators] = useState<[string[], bigint[]] | null>(null);
  const [isLoadingDonators, setIsLoadingDonators] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  const isOwner = campaign.owner.toLowerCase() === currentAccount.toLowerCase();

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationAmount || parseFloat(donationAmount) <= 0) return;
    
    donate(id, donationAmount);
    setDonationAmount("");
    setShowDonateModal(false);
  };

  const handleShowDonators = async () => {
    try {
      setIsLoadingDonators(true);
      const result = await getDonators(id);
      setDonators(result);
      setShowDonators(true);
    } catch (error) {
      console.error("Error fetching donators:", error);
    } finally {
      setIsLoadingDonators(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setIsWithdrawing(true);
      await withdrawFunds(id);
      alert("Funds withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert("Failed to withdraw funds. See console for details.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{campaign.title}</h3>
          {isOwner && (
            <button 
              onClick={() => deleteCampaign(id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          )}
        </div>

        <p className="text-gray-700 mb-4">{campaign.description}</p>

        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <div className="mb-3">
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(Number(campaign.amountCollected) * 100 / Number(campaign.target), 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700">Raised</p>
              <p className="font-semibold text-gray-800">
                {formatEther(campaign.amountCollected)} ETH
              </p>
            </div>
            <div>
              <p className="text-gray-700">Target</p>
              <p className="font-semibold text-gray-800">
                {formatEther(campaign.target)} ETH
              </p>
            </div>
            <div>
              <p className="text-gray-700">Days Left</p>
              <p className="font-semibold text-gray-800">{daysLeft(campaign.deadline)}</p>
            </div>
            <div>
              <p className="text-gray-700">Owner</p>
              <p className="font-semibold text-gray-800">{shortenAddress(campaign.owner)}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowDonateModal(true)}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Donate
          </button>
          <button
            onClick={handleShowDonators}
            disabled={isLoadingDonators}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            {isLoadingDonators ? "Loading..." : "Donators"}
          </button>
          
          {isOwner && (
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {isWithdrawing ? "..." : "Withdraw"}
            </button>
          )}
        </div>

        {/* Donate Modal */}
        {showDonateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Donate to {campaign.title}</h3>
              <form onSubmit={handleDonate}>
                <input
                  type="text"
                  placeholder="Amount in ETH"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 mb-4"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDonateModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Donators Modal */}
        {showDonators && donators && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Donators List</h3>
              {donators[0].length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  {donators[0].map((address, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <span className="text-gray-700">{shortenAddress(address)}</span>
                      <span className="font-medium text-gray-800">{formatEther(donators[1][index])} ETH</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700">No donations yet</p>
              )}
              <button
                onClick={() => setShowDonators(false)}
                className="mt-4 w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;








