"use client";

import { checkEmailPresent } from "@/actions/check-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export const ResendVerificationButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState<string | null>("");

  async function resendVerificationEmail() {
    if (!email) return;

    setSuccess(null);
    setError(null);
    setIsLoading(true);

    const result = await checkEmailPresent({ email });

    if (!result?.success) {
      setError(result?.message ?? "Some error occurred. Try again!");
      setIsLoading(false);
      return;
    }

    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/email-verified",
    });

    setIsLoading(false);

    if (error) {
      setError(error?.message ?? "Something went wrong!");
    } else {
      setSuccess("Verification Email Sent Successfully!");
    }
  }

  return (
    <div className='space-y-4 max-w-md'>
      {success && (
        <div role='status' className='text-sm text-green-600'>
          {success}
        </div>
      )}
      {error && (
        <div role='alert' className='text-sm text-rose-400'>
          {error}
        </div>
      )}
      <Input
        placeholder='Enter email to verify'
        type='email'
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        type='button'
        onClick={resendVerificationEmail}
        disabled={isLoading}
        className='w-full'
      >
        {isLoading ? "Resending" : "Resend"} Verification Email
      </Button>
    </div>
  );
};
