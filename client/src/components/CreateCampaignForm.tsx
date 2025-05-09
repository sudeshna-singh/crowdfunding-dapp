"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useBlockchain } from "../context/BlockchainContext";

interface CampaignForm {
  title: string;
  description: string;
  target: string;
  deadline: string;
}

const CreateCampaignForm = () => {
  const { createCampaign, isLoading } = useBlockchain();
  const router = useRouter();

  const [form, setForm] = useState<CampaignForm>({
    title: "",
    description: "",
    target: "",
    deadline: ""
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createCampaign(form);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a Campaign</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 text-gray-700 font-medium">
            Campaign Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
            placeholder="Write a title"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 text-gray-700 font-medium">
            Story
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleFormChange}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
            placeholder="Tell your story"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="target" className="block mb-2 text-gray-700 font-medium">
              Goal Amount (ETH)
            </label>
            <input
              id="target"
              name="target"
              type="number"
              step="0.01"
              value={form.target}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
              placeholder="0.5"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="deadline" className="block mb-2 text-gray-700 font-medium">
              End Date
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-3 rounded font-medium text-white ${
            isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Creating Campaign..." : "Create Campaign"}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaignForm;



