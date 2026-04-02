"use client"

import AdminDashboard from "@/components/Dashboard/Dashboard";
import StaffDashboard from "@/components/Dashboard/StaffDashboard";
import AccessDenied from "@/components/ui/AccessDenied";
import { useAuth } from "@/context/AuthContext";

const MANAGER_ROLES = [5]; // role_id 5 = manager/admin

const App = () => {

  const { user, loading, hasModuleAccess } = useAuth();

  if (loading) return;

  const isManager = MANAGER_ROLES.includes(user?.role_id);

  return (
    <div className="p-5 bg-gray-200 dark:bg-slate-900">
      {isManager ? <AdminDashboard /> : <StaffDashboard />}
    </div>
  );


};

export default App;

