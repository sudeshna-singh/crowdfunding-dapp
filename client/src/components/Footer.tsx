"use client";
import Link from "next/link";

const Footer = () => (
  <footer className="w-full bg-blue-50 border-t border-blue-200 mt-12 py-6">
    <div className="container mx-auto flex flex-col items-center gap-4 px-4">
      <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
        Home
      </Link>
      <Link href="/your-campaigns" className="text-gray-700 hover:text-blue-600 font-medium transition">
        Your Campaigns
      </Link>
      <Link href="/create-campaign" className="text-gray-700 hover:text-blue-600 font-medium transition">
        Create Campaign
      </Link>
      <span className="text-xs text-gray-400 mt-2">
        &copy; {new Date().getFullYear()} CrowdFunding DApp. All rights reserved.
      </span>
    </div>
  </footer>
);

export default Footer;

