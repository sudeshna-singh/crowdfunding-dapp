import "./globals.css";
import type { Metadata } from "next";
import { BlockchainProvider } from "../context/BlockchainContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Crowdfunding DApp",
  description: "Blockchain-based crowdfunding platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BlockchainProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto py-8 px-4">{children}</main>
            <Footer />
          </div>
        </BlockchainProvider>
      </body>
    </html>
  );
}
