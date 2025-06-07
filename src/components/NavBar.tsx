import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogInClick = () => {
    navigate("/sign-in");
    setIsOpen(false);
  };

  const handleHomeClick = () => {
    navigate("/");
    setIsOpen(false);
  };

  const handleCreateAccClick = () => {
    navigate("/sign-up");
    setIsOpen(false);
  };

  return (
    <nav className="flex flex-col  items-center bg-white border-b shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between w-full">
        <div className="text-xl font-bold cursor-pointer" onClick={handleHomeClick}>
          Quiz Me
        </div>
        <div className="sm:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
        <ul className="hidden sm:flex space-x-6 items-center gap-2 w-fullml-auto">
          <li>
            <button onClick={handleCreateAccClick} className="cursor-pointer">
              Create Account
            </button>
          </li>
          <li>
            <button
              onClick={handleLogInClick}
              className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium focus:outline-blue-900 focus:bg-blue-700 cursor-pointer"
            >
              Log In
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="sm:hidden px-4 pb-4 space-y-4 bg-white pt-4">
          <li>
            <button onClick={handleCreateAccClick} className="cursor-pointer">
              Create Account
            </button>
          </li>
          <li className="flex justify-center">
            <button
              onClick={handleLogInClick}
              className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium focus:outline-blue-900 focus:bg-blue-700 cursor-pointer"
            >
              Log In
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}
