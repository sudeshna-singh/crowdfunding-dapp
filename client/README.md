# Crowdfunding DApp

A blockchain-based crowdfunding platform where users can create campaigns, donate, withdraw funds, and view donators. Built with Solidity, Next.js, and Hardhat.

---

## Getting Started

### 1. Clone the repository

git clone https://github.com/sudeshna-singh/crowdfunding-dapp.git
cd crowdfunding-dapp

### 2. Install dependencies

cd hardhat
npm install
cd ../client
npm install

### 3. Set up environment variables

- Copy `.env.example` to `.env` in the root or `client/` folder.
- Add your contract address after deploying locally.

### 4. Start local blockchain and deploy contract

cd hardhat
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

### 5. Start the frontend

cd ../client
npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

- Connect your MetaMask wallet to `localhost:8545`
- Create and manage campaigns
- Donate to campaigns as any account
- Withdraw funds as campaign owner
- View donators for each campaign

---

## Project Structure

crowdfunding-dapp/
├── client/ # Frontend (Next.js)
├── hardhat/ # Smart contracts and scripts
├── .env # Environment variables (not committed)
├── .gitignore
└── README.md


---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## License

[MIT](LICENSE)
