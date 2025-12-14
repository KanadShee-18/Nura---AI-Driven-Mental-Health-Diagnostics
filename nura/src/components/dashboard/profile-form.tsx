"use client";

import type { User } from "@/generated/prisma/client";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";

export const ProfileForm = ({
  email,
  name,
  oauthEnabled = false,
  imageUrl,
}: {
  email: string;
  name: string;
  oauthEnabled: boolean;
  imageUrl?: string;
}) => {
  const router = useRouter();

  const [newEmail, setNewEmail] = useState<string | null>(email);
  const [newName, setNewName] = useState<string | null>(name);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleNameSubmit = async () => {
    if (newName?.trim() === name) {
      toast.info("No new change found in name");
      return;
    }

    if (!newName) {
      toast.error("New Name is required!");
      return;
    }

    setError(null);
    setStatus(null);
    setLoading(true);

    const { error } = await authClient.updateUser({ name: newName });

    if (error) {
      setError(error.message ?? "Some error occurred while changing the name");
    } else {
      setStatus("Profile Name has been updated!");
      toast.success("Name has been updated successfully!");
      router.refresh();
    }

    setLoading(false);
  };

  // const handleEmailUpdate = async () => {
  //   if (newEmail?.trim() === email) {
  //     toast.info("No new change found in email!");
  //     return;
  //   }

  //   if (!newEmail) {
  //     toast.error("New Email is required!");
  //     return;
  //   }

  //   setError(null);
  //   setStatus(null);
  //   setLoading(true);

  //   const { error } = await authClient.changeEmail({
  //     newEmail,
  //     callbackURL: "/email-verified",
  //   });

  //   if (error) {
  //     setError(error.message ?? "Some error occurred while updating the email");
  //   } else {
  //     setStatus("Verification Email sent successfully!");
  //     toast.success("Verification Email sent successfully!");
  //     router.refresh();
  //   }

  //   setLoading(false);
  // };

  const handlePasswordUpdate = async () => {
    if (!newPassword || !currentPassword) {
      toast.error("Current and New both Passwords are required!");
      return;
    }

    setError(null);
    setStatus(null);
    setLoading(true);

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      setError(
        error.message ?? "Some error occurred while updating the password"
      );
    } else {
      setStatus("Password updated successfully!");
      toast.success("Password Updated successfully!");
      router.refresh();
    }

    setNewPassword("");
    setCurrentPassword("");
    setLoading(false);
  };

  const handleAllSessionRevoke = async () => {
    setError(null);
    setLoading(true);

    const { error } = await authClient.revokeSessions();

    setLoading(false);

    if (error) {
      setError(error.message ?? "Something went wrong!");
      toast.error("Error while revoking sessions!");
    } else {
      toast.success("All sessions revoked successfully!");
      window.location.replace("/sign-in");
    }
  };

  return (
    <div className='my-10 pb-20'>
      {error && (
        <p className='dark:text-rose-300 text-center text-rose-500 text-sm'>
          {error}
        </p>
      )}

      {status && (
        <p className='dark:text-emerald-300 text-center text-emerald-500 text-sm'>
          {status}
        </p>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5 mt-5 max-w-xl lg:max-w-2xl mx-auto'>
        <div className='col-span-2 md:col-span-1'>
          <Card className='p-6'>
            <h2 className='text-2xl font-semibold'>Profile Details</h2>
            {imageUrl?.length && (
              <Image
                src={imageUrl}
                alt={name[0]}
                width={50}
                height={50}
                unoptimized
                className='rounded-sm shadow-2xl'
              />
            )}
            <div>
              <p className='text-sm my-1'>Your Name</p>
              <Input
                value={newName || ""}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            {!oauthEnabled && (
              <Button
                disabled={loading}
                onClick={() => handleNameSubmit()}
                type='button'
                size={"sm"}
              >
                {loading ? "Changing" : "Change"} Name
              </Button>
            )}
          </Card>
        </div>
        <div className='col-span-2 md:col-span-1'>
          <Card className='p-6 h-full'>
            <h2 className='text-2xl font-semibold'>Registered Email</h2>
            <div>
              <p className='text-sm my-1'>Email</p>
              <Input
                disabled
                value={email}
                onChange={(e) => setNewEmail(e.target.value)}
                className='cursor-not-allowed'
              />
            </div>
            {/* {!oauthEnabled && (
              <Button
                onClick={() => handleEmailUpdate()}
                disabled={loading}
                type='button'
                size={"sm"}
              >
                {loading ? "Processing ..." : "Request Change"}
              </Button>
            )} */}
          </Card>
        </div>
        {!oauthEnabled && (
          <div className='col-span-2 md:col-span-2'>
            <div>
              <Card className='p-6'>
                <h2 className='text-2xl font-semibold'>Change Password</h2>
                <div>
                  <p className='text-sm my-1'>Current Password</p>
                  <Input
                    type='password'
                    placeholder='Current Password'
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div>
                  <p className='text-sm my-1'>New Password</p>
                  <Input
                    type='password'
                    placeholder='New Password'
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => handlePasswordUpdate()}
                  disabled={loading}
                  type='button'
                  size={"sm"}
                >
                  {loading ? "Changing" : "Change"} Password
                  {loading && <LoaderIcon className='animate-spin' />}
                </Button>
              </Card>
            </div>
          </div>
        )}
        <div className='col-span-2 md:col-span-2'>
          <Button
            disabled={loading}
            onClick={() => handleAllSessionRevoke()}
            variant={"outline"}
            className='w-full'
          >
            {loading ? "Revoking ..." : "Log out from all Logged In Devices"}
          </Button>
        </div>
      </div>
    </div>
  );
};
