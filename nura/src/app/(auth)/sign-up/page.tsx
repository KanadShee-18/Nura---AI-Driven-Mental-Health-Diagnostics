import { RegisterForm } from "@/components/auth/forms/register-form";
import { requireUnAuth } from "@/lib/get-session";

export default async function SignUpPage() {
  await requireUnAuth();

  return (
    <div className='relative'>
      <RegisterForm />
    </div>
  );
}
