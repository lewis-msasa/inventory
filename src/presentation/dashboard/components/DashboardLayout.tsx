import React from "react";
import InvoicesCard from "../../common/InvoiceCard";
import JobsCard from "./JobCard";

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Today</h1>
      <div className="flex flex-col gap-4">
        <JobsCard />
        <InvoicesCard />
      </div>
    </div>
  );
};

export default Dashboard;