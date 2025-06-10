import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (!localStorage.getItem("userId")) throw new Error();
        const response = await fetch(`${import.meta.env.VITE_API}/auth/status`, { credentials: "include" });
        if (!response.ok) throw new Error();
      } catch (error) {
        navigate({ to: "/sign-in" });
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogOut = async () => {
    await fetch(`${import.meta.env.VITE_API}/logout`, { credentials: "include" });
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <div className="h-screen">
      {/* Top Bar (Mobile only) */}
      <header className="lg:hidden flex items-center justify-start gap-4 h-16 px-4 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-200">
          {/* Hamburger Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold">Quiz Me</h1>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`bg-white fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header with close button on mobile */}
          <div className="flex items-center justify-between h-16 px-4">
            <h1 className="text-3xl font-bold">Quiz Me</h1>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md hover:bg-gray-200 lg:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto text-lg">
            <Link to="/home" className="block px-4 py-2 rounded hover:bg-gray-200 transition-colors" onClick={() => setSidebarOpen(false)}>
              Home
            </Link>
            <Link
              to={"/user/$userId"}
              params={{ userId: localStorage.getItem("userId")! }}
              className="block px-4 py-2 rounded hover:bg-gray-200 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              Account
            </Link>
            <button onClick={handleLogOut} className="block px-4 py-2 rounded hover:bg-gray-200 transition-colors w-full text-start">
              Log Out
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 mt-16 lg:mt-0 h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRoute;
