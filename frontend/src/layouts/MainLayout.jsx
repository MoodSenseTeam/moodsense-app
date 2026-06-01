import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#1f3f31]">
      <Outlet />
    </div>
  );
}

export default MainLayout;
