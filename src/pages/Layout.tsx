import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/NavBar";
import { useEffect } from "react";

export default function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        if (!localStorage.getItem("userId")) return;
        const res = await fetch(`${import.meta.env.VITE_API}/auth/status`, { credentials: "include" });
        if (res.ok) navigate("/home");
      } catch (error) {}
    };
    isLoggedIn();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <Outlet />
    </div>
  );
}
