import { useEffect } from "react";
import { useLocation } from "react-router";

const GoogleAuth = () => {
  const location = useLocation();

  useEffect(() => {
    const load = async () => {
      if (!location.hash) return;
      const hash = location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      if (!accessToken) return;
      const res = await fetch(`${import.meta.env.VITE_API}/auth/oauth`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      if (!res.ok) return alert("Something went wrong. Please try again later.");
      const data = await res.json();
      localStorage.setItem("userId", data.userId);
      window.location.href = "/home";
    };
    load();
  }, [location]);

  return <></>;
};

export default GoogleAuth;
