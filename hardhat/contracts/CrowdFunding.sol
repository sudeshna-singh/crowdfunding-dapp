// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
        bool isActive;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    event CampaignCreated(uint256 indexed campaignId, address indexed owner);
    event CampaignDeleted(uint256 indexed campaignId);
    event DonationReceived(uint256 indexed campaignId, address donor, uint256 amount);
    event FundsWithdrawn(uint256 indexed campaignId, address indexed owner, uint256 amount);

    // Create a new campaign
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        
        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.isActive = true;

        numberOfCampaigns++;
        
        emit CampaignCreated(numberOfCampaigns - 1, msg.sender);
        return numberOfCampaigns - 1;
    }

    // Donate to a campaign
    function donateToCampaign(uint256 _id) public payable {
        require(_id < numberOfCampaigns, "Invalid campaign ID");
        require(campaigns[_id].isActive, "Campaign is inactive");
        require(block.timestamp < campaigns[_id].deadline, "Campaign has ended");

        Campaign storage campaign = campaigns[_id];
        
        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);
        campaign.amountCollected += msg.value;

        (bool sent,) = payable(campaign.owner).call{value: msg.value}("");
        require(sent, "Failed to transfer funds to campaign owner");
        
        emit DonationReceived(_id, msg.sender, msg.value);
    }

    // Delete a campaign (soft delete)
    function deleteCampaign(uint256 _id) public {
        require(_id < numberOfCampaigns, "Invalid campaign ID");
        require(msg.sender == campaigns[_id].owner, "Only owner can delete");
        require(campaigns[_id].isActive, "Campaign already deleted");

        campaigns[_id].isActive = false;
        emit CampaignDeleted(_id);
    }

    // Withdraw funds (marks campaign as withdrawn)
    function withdrawFunds(uint256 _id) public {
        require(_id < numberOfCampaigns, "Invalid campaign ID");
        require(msg.sender == campaigns[_id].owner, "Only owner can withdraw funds");
        require(campaigns[_id].isActive, "Campaign is not active");
        
        Campaign storage campaign = campaigns[_id];
        uint256 amount = campaign.amountCollected;
        
        // Since funds are already transferred during donation, this just marks
        // the campaign as complete/withdrawn
        campaign.isActive = false;
        
        emit FundsWithdrawn(_id, msg.sender, amount);
    }

    // Get all campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        
        for(uint256 i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }
        
        return allCampaigns;
    }

    // Get donators for a specific campaign
    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        require(_id < numberOfCampaigns, "Invalid campaign ID");
        return (campaigns[_id].donators, campaigns[_id].donations);
    }
}


