import { useState } from "react";
import { Menu, X } from "lucide-react"; // optional: lucide for icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen sticky left-0">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold">My App</h2>
        <nav className="flex flex-col space-y-2">
          <a href="#" className="hover:bg-gray-700 rounded p-2">
            Dashboard
          </a>
          <a href="#" className="hover:bg-gray-700 rounded p-2">
            Settings
          </a>
          <a href="#" className="hover:bg-gray-700 rounded p-2">
            Profile
          </a>
        </nav>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-800 text-white p-4 w-full">
        <h2 className="text-xl font-bold">My App</h2>
        <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)}>
          <aside className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold">My App</h2>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="hover:bg-gray-700 rounded p-2">
                Dashboard
              </a>
              <a href="#" className="hover:bg-gray-700 rounded p-2">
                Settings
              </a>
              <a href="#" className="hover:bg-gray-700 rounded p-2">
                Profile
              </a>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      {/* <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold">Welcome</h1>
        <p>Content goes here...</p>
      </main> */}
    </div>
  );
};

export default Sidebar;
