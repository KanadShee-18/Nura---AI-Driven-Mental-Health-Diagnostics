import { requireAuth } from "@/lib/get-session";

const DashboardPage = async () => {
  await requireAuth();
  return (
    <div className='flex items-center justify-center w-full flex-1 h-screen'>
      Dashboard Page
    </div>
  );
};
export default DashboardPage;
