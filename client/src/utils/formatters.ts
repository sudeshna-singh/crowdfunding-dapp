import { ethers } from "ethers";

export const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEther = (amount: bigint): string => {
  return ethers.formatEther(amount);
};

export const formatDate = (timestamp: bigint): string => {
  return new Date(Number(timestamp) * 1000).toLocaleDateString();
};

export const calculateBarPercentage = (goal: bigint, collected: bigint): number => {
  const percentage = Number(collected) * 100 / Number(goal);
  return percentage > 100 ? 100 : percentage;
};

export const daysLeft = (deadline: bigint): number => {
  const remaining = Number(deadline) - Date.now() / 1000;
  const days = remaining / 86400;
  return days > 0 ? Math.ceil(days) : 0;
};

