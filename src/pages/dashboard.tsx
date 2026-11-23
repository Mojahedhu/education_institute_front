import { useEffect } from "react";
import { toast } from "sonner";

const Dashboard = () => {
  useEffect(() => {
    toast.success("test the toast theme", { richColors: true });
  }, []);
  return <div>dashboard</div>;
};

export default Dashboard;
