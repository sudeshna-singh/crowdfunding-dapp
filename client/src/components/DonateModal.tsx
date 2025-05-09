import React, { useState } from "react";
import { formatEther, shortenAddress } from "../utils/formatters";

type Campaign = {
  owner: string;
  title: string;
  description: string;
  target: bigint;
  deadline: bigint;
  amountCollected: bigint;
};

type DonateModalProps = {
  campaign: Campaign | null;
  onClose: () => void;
  onDonate: (amount: string) => void;
};

const DonateModal: React.FC<DonateModalProps> = ({ campaign, onClose, onDonate }) => {
  const [amount, setAmount] = useState("");

  if (!campaign) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    onDonate(amount);
    setAmount("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Donate to {campaign.title}
        </h3>
        
        <div className="mb-4">
          <p className="text-gray-600">Campaign Owner: {shortenAddress(campaign.owner)}</p>
          <p className="text-gray-600">
            Target: {formatEther(campaign.target)} ETH
          </p>
          <p className="text-gray-600">
            Raised so far: {formatEther(campaign.amountCollected)} ETH
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block mb-2 text-gray-700">
              Amount (ETH)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.01"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Donate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonateModal;
