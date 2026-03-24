import React from "react";
import { Clock, Calendar, Check } from "lucide-react";

interface JobStatusBadgeProps {
  icon: React.ReactNode;
  status: string;
  time: string;
  faded?: boolean;
}

const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({
  icon,
  status,
  time,
  faded = false,
}) => (
  <div
    className={`bg-white rounded-lg px-4 py-2.5 shadow-sm border border-gray-100 min-w-[180px] ${
      faded ? "opacity-50" : ""
    }`}
  >
    <div className="flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 leading-tight">{status}</p>
        <p className="text-sm font-medium text-gray-800 leading-tight">{time}</p>
      </div>
    </div>
  </div>
);

const JobsCard: React.FC = () => {
  return (
    <div className="bg-stone-100 rounded-xl p-6 flex items-center justify-between gap-6">
      {/* Left: text + button */}
      <div className="flex flex-col gap-4 flex-1">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Start your first job</h2>
          <p className="text-sm text-gray-500 mt-1">
            Jobs help you track work from start to finish
          </p>
        </div>
        <div>
          <button className="w-full md:w-auto bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-3 rounded-lg transition-colors">
            Create first job
          </button>
        </div>
      </div>

      {/* Right: status badges — desktop only */}
      <div className="hidden md:flex flex-col gap-2 items-end">
        <JobStatusBadge
          icon={<Clock size={15} />}
          status="In progress"
          time="Today, 10:00 AM"
        />
        <JobStatusBadge
          icon={<Calendar size={15} />}
          status="Scheduled"
          time="Tomorrow, 12:00 AM"
        />
        <JobStatusBadge
          icon={<Check size={15} />}
          status="Completed"
          time=""
          faded
        />
      </div>
    </div>
  );
};

export default JobsCard;