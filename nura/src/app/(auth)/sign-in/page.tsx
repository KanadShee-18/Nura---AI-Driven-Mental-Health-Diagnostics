import { LoginForm } from "@/components/auth/forms/login-form";
import { requireUnAuth } from "@/lib/get-session";

export default async function LoginPage() {
  await requireUnAuth();
  return (
    <div>
      <LoginForm />
    </div>
  );
}
