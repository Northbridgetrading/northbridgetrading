import Navbar from "../components/layout/Navbar";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
      <Navbar authOnly />
      <Outlet />
    </>
  );
}