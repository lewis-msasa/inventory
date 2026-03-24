import React from 'react';
import Button from '../../common/Button';
import Card from '../../common/Card';

const MainContent: React.FC = () => {
  return (
    <main className="flex-1 p-8 bg-gray-50">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h2>
        <p className="text-gray-600">Here's what's happening with your jobs today.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <p className="text-sm opacity-90">Active Jobs</p>
          <p className="text-3xl font-bold mt-2">0</p>
          <p className="text-sm mt-2 opacity-80">No active jobs</p>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <p className="text-sm opacity-90">Completed Today</p>
          <p className="text-3xl font-bold mt-2">0</p>
          <p className="text-sm mt-2 opacity-80">No jobs completed</p>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <p className="text-sm opacity-90">Total Earnings</p>
          <p className="text-3xl font-bold mt-2">$0</p>
          <p className="text-sm mt-2 opacity-80">This month</p>
        </Card>
      </div>

      {/* Recent Jobs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Jobs</h3>
          <Button variant="outline">View All</Button>
        </div>
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No jobs yet</p>
            <Button variant="primary">
              Create Your First Job
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="secondary" className="py-3">
            + New Job
          </Button>
          <Button variant="secondary" className="py-3">
            📄 Create Invoice
          </Button>
          <Button variant="secondary" className="py-3">
            👥 Add Client
          </Button>
          <Button variant="secondary" className="py-3">
            🛠️ Add Worker
          </Button>
        </div>
      </div>
    </main>
  );
};

export default MainContent;