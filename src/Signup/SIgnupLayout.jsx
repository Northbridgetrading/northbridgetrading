import { Outlet } from "react-router-dom";

export default function SignupLayout() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <Outlet />
    </div>
  );
}