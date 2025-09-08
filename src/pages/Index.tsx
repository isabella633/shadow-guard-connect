import { useState } from "react";
import { VpnDashboard } from "@/components/VpnDashboard";
import { AuthFlow } from "@/components/AuthFlow";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthFlow onLogin={() => setIsAuthenticated(true)} />;
  }

  return <VpnDashboard />;
};

export default Index;
