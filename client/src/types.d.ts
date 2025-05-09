// client/src/types.d.ts
export interface Campaign {
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

export interface CampaignCardProps {
  campaign: Campaign;
  id: number;
}

export interface CampaignForm {
  title: string;
  description: string;
  target: string;
  deadline: string;
}
