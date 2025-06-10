import { createFileRoute } from "@tanstack/react-router";
import LogInSignUpTemplate from "@/components/LogInSignUpTemplate";

export const Route = createFileRoute("/_auth/sign-up")({
  component: SignUp,
});

function SignUp() {
  return <LogInSignUpTemplate isSignIn={false} />;
}
