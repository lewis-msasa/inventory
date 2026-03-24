import React, { useState } from "react";
import Sidebar from "./presentation/common/SideBar";
import Dashboard from "./presentation/dashboard/components/DashboardLayout";
import BottomNav from "./presentation/common/BottomNav";
import InvoicesPage from "./presentation/invoices/InvoicePage";

const pageMap: Record<string, React.ReactNode> = {
  "My Tofu": <Dashboard />,
  //Jobs: <JobsPage />,
  Invoices: <InvoicesPage />,
  // Estimates: <EstimatesPage />,
  // Clients: <ClientsPage />,
  // "Price book": <PriceBookPage />,
  // Workers: <WorkersPage />,
  // Settings: <SettingsPage />,
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState("My Tofu");

  return (
     <div className="flex h-screen bg-white font-sans overflow-hidden">
      {/* Sidebar: visible on md+ */}
      <div className="hidden md:flex">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
      </div>
 
      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {pageMap[activePage] ?? <Dashboard />}
      </main>
 
      {/* Bottom nav: visible on mobile only */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden">
        <BottomNav activePage={activePage} onNavigate={setActivePage} />
      </div>
    </div>
  );
};

export default App;