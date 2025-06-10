import { createFileRoute } from "@tanstack/react-router";
import LogInSignUpTemplate from "@/components/LogInSignUpTemplate";

export const Route = createFileRoute("/_auth/sign-in")({
  component: LogIn,
});

function LogIn() {
  return <LogInSignUpTemplate isSignIn={true} />;
}
