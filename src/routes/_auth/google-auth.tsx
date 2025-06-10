import { useEffect } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/google-auth")({
  component: GoogleAuth,
});

function GoogleAuth() {
  const location = useSearch({ from: "/_auth/google-auth" });

  useEffect(() => {
    const load = async () => {
      const hash = window.location.hash.substring(1);
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
}

export default GoogleAuth;
