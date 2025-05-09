"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";


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

interface CampaignForm {
  title: string;
  description: string;
  target: string;
  deadline: string;
}

interface BlockchainContextType {
  currentAccount: string;
  connectWallet: () => Promise<void>;
  contract: ethers.Contract | null;
  createCampaign: (form: CampaignForm) => Promise<void>;
  getCampaigns: () => Promise<Campaign[]>;
  campaigns: Campaign[];
  deleteCampaign: (id: number) => Promise<void>;
  donate: (id: number, amount: string) => Promise<void>;
  getDonators: (id: number) => Promise<[string[], bigint[]]>;
  withdrawFunds: (id: number) => Promise<void>; // Added this new function
  isLoading: boolean;
}

const contractABI = [
  {
    "inputs": [
      {"internalType": "string","name": "_title","type": "string"},
      {"internalType": "string","name": "_description","type": "string"},
      {"internalType": "uint256","name": "_target","type": "uint256"},
      {"internalType": "uint256","name": "_deadline","type": "uint256"}
    ],
    "name": "createCampaign",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],
    "name": "deleteCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],
    "name": "donateToCampaign",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCampaigns",
    "outputs": [
      {
        "components": [
          {"internalType": "address","name": "owner","type": "address"},
          {"internalType": "string","name": "title","type": "string"},
          {"internalType": "string","name": "description","type": "string"},
          {"internalType": "uint256","name": "target","type": "uint256"},
          {"internalType": "uint256","name": "deadline","type": "uint256"},
          {"internalType": "uint256","name": "amountCollected","type": "uint256"},
          {"internalType": "address[]","name": "donators","type": "address[]"},
          {"internalType": "uint256[]","name": "donations","type": "uint256[]"},
          {"internalType": "bool","name": "isActive","type": "bool"}
        ],
        "internalType": "struct CrowdFunding.Campaign[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],
    "name": "getDonators",
    "outputs": [
      {"internalType": "address[]","name": "","type": "address[]"},
      {"internalType": "uint256[]","name": "","type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "numberOfCampaigns",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];


const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";


const BlockchainContext = createContext<BlockchainContextType | null>(null);

export const BlockchainProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        if (typeof window.ethereum === "undefined") return;
        
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length) {
          setCurrentAccount(accounts[0]);
          await setupEthers();
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    if (contract) {
      loadCampaigns();
    }
  }, [contract]);

  const loadCampaigns = async () => {
    if (!contract) return;
    try {
      const data = await contract.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error("Error loading campaigns:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") 
        throw new Error("MetaMask not installed");
      
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      
      setCurrentAccount(accounts[0]);
      await setupEthers();
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  const setupEthers = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, 
        contractABI, 
        signer
      );
      
      // Fixed part - Add null check before accessing functions
      console.log("Contract initialized:", !!contractInstance);
      if (contractInstance && contractInstance.functions) {
        console.log("Available methods:", Object.keys(contractInstance.functions));
      } else {
        console.log("Contract functions not available yet");
      }
      
      setContract(contractInstance);
    } catch (error) {
      console.error("Contract setup error:", error);
    }
  };

  const createCampaign = async (form: CampaignForm) => {
    if (!contract) throw new Error("Contract not initialized");
    
    try {
      setIsLoading(true);
      const targetWei = ethers.parseEther(form.target);
      const deadlineUnix = Math.floor(new Date(form.deadline).getTime() / 1000);
      
      const tx = await contract.createCampaign(
        form.title,
        form.description,
        targetWei,
        deadlineUnix
      );
      
      await tx.wait();
      await loadCampaigns();
    } catch (error) {
      console.error("Create campaign error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCampaign = async (id: number) => {
    if (!contract) throw new Error("Contract not initialized");
    
    try {
      setIsLoading(true);
      const tx = await contract.deleteCampaign(id);
      await tx.wait();
      await loadCampaigns();
    } catch (error) {
      console.error("Delete campaign error:", error);
      alert("Failed to delete campaign. Make sure you are the owner.");
    } finally {
      setIsLoading(false);
    }
  };

  const donate = async (id: number, amount: string) => {
    if (!contract) throw new Error("Contract not initialized");
    
    try {
      setIsLoading(true);
      const tx = await contract.donateToCampaign(id, {
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      await loadCampaigns();
    } catch (error) {
      console.error("Donation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDonators = async (id: number): Promise<[string[], bigint[]]> => {
    if (!contract) throw new Error("Contract not initialized");
    try {
      return await contract.getDonators(id);
    } catch (error) {
      console.error("Error getting donators:", error);
      throw error;
    }
  };

  // New function to withdraw funds
  const withdrawFunds = async (id: number): Promise<void> => {
    if (!contract) throw new Error("Contract not initialized");
    
    try {
      setIsLoading(true);
      const tx = await contract.withdrawFunds(id);
      await tx.wait();
      await loadCampaigns();
    } catch (error) {
      console.error("Withdrawal error:", error);
      alert("Failed to withdraw funds. Make sure you are the owner.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCampaigns = async (): Promise<Campaign[]> => {
    if (!contract) return [];
    
    try {
      await loadCampaigns();
      return campaigns.filter((campaign: Campaign) => campaign.isActive);
    } catch (error) {
      console.error("Error getting campaigns:", error);
      return [];
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        currentAccount,
        connectWallet,
        contract,
        createCampaign,
        getCampaigns,
        campaigns: campaigns.filter((campaign: Campaign) => campaign.isActive),
        deleteCampaign,
        donate,
        getDonators,
        withdrawFunds, // Added the new function
        isLoading
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) throw new Error("useBlockchain must be used within BlockchainProvider");
  return context;
};
