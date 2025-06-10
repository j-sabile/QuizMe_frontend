import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const LogInSignUpTemplate: React.FC<{ isSignIn: boolean }> = ({ isSignIn }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (isSignIn) {
      const res = await fetch(`${import.meta.env.VITE_API}/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("userId", data.userId);
        window.location.href = "/home";
      } else alert("Incorrect credentials");
      setPassword("");
    } else {
      const res = await fetch(`${import.meta.env.VITE_API}/createacc`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        alert("Successfully created account");
        navigate({ to: "/sign-in" });
      } else if (res.status === 409) alert("Username is already taken");
      else alert("An error has occured. Please try again later.");
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI);
    const scope = encodeURIComponent("https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid");
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    window.location.href = authUrl;
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-56px)]">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {/* Header */}
          <div className="flex flex-col w-full justify-center items-center mt-4 mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Quiz Me</h1>
            <p className="text-slate-600">{`${isSignIn ? "Sign in to" : "Create"} your account to continue`}</p>
          </div>

          {/* LogInSignUpTemplate Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-slate-700">
                Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  autoComplete="username"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
                  className="pl-10 h-12 border-slate-200 focus:border-slate-600 focus:ring-slate-400 focus:outline-0 w-full border-[1px] rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete={isSignIn ? "current-password" : "new-password"}
                  className="pl-10 pr-10 h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-600 focus:outline-0 w-full border-[1px] rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            {isSignIn && (
              <div className="flex justify-end">
                <p className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Forgot password?</p>
              </div>
            )}

            {/* Sign In button */}
            <button
              type="submit"
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors rounded-lg focus:bg-slate-800"
              disabled={isLoading}
            >
              {isSignIn ? (isLoading ? "Signing in..." : "Sign in") : isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <hr />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-slate-500">or</span>
          </div>

          {/* Google Sign In */}
          <button
            className="flex flex-row justify-center items-center w-full h-12 mb-6 border-slate-200 hover:bg-slate-50 transition-colors border-[1px] rounded-lg"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Create Account / Have an Account */}
          <p className="text-center text-sm text-slate-600 mb-4 mt-12">
            {isSignIn ? "Don't h" : "H"}ave an account?{" "}
            <Link to={isSignIn ? "/sign-up" : "/sign-in"} className="text-blue-600 hover:underline">
              {isSignIn ? "Register" : "Sign in"}
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500">
            By signing in, you agree to our
            <br />
            <span className="underline hover:text-slate-700 transition-colors">Terms of Service</span> and{" "}
            <span className="underline hover:text-slate-700 transition-colors">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogInSignUpTemplate;
