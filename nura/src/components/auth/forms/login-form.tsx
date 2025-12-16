"use client";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronRightIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderIcon,
  LockKeyholeOpenIcon,
  MailIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import z from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Please provide a valid email" }),
  password: z
    .string({ error: "Password is required to login" })
    .min(6, { error: "Password should be min 6 chars" })
    .max(32, { error: "Password should be max 32 chars" }),
});

export const LoginForm = () => {
  const router = useRouter();

  const [errMesg, setErrMesg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [oauthGoogleLoading, setOauthGoogleLoading] = useState<boolean>(false);
  const [oauthGithubLoading, setOauthGithubLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isPending = form.formState.isSubmitting;

  const onFormSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (!values.email || !values.password) return;

    setErrMesg(null);
    setLoading(true);

    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          setLoading(false);
          router.push("/dashboard");
        },
        onError: ({ error }) => {
          if (error.code === "EMAIL_NOT_VERIFIED") {
            router.push("/verify-email");
          }
          setErrMesg(error.message ?? "Something went wrong while login.");
          toast.error(
            error.message ?? "Something went wrong while signing in!"
          );

          form.reset();
        },
      }
    );
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setErrMesg(null);
    if (provider === "google") {
      setOauthGoogleLoading(true);
    } else {
      setOauthGithubLoading(true);
    }

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
    });

    setOauthGoogleLoading(false);
    setOauthGithubLoading(false);

    if (error) {
      setErrMesg(error.message ?? "Something went wrong!");
    }
  };

  return (
    <div className=''>
      <Container className='pt-16 px-5 md:px-10 min-h-screen'>
        <div className='flex mt-24 items-center justify-center'>
          <Card className='w-100 py-8'>
            <CardHeader>
              <h3 className='text-3xl font-semibold'>Welcome Back</h3>
              <p className='text-sm text-muted-foreground font-medium'>
                Get you mental health testing with some basic details
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onFormSubmit)}
                  className='space-y-6'
                >
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className='w-full h-fit relative'>
                            <span className='absolute top-1/2 -translate-y-1/2 left-2.5'>
                              <MailIcon className='size-4 text-indigo-500' />
                            </span>
                            <Input
                              type='email'
                              placeholder='Provide registered email'
                              {...field}
                              disabled={isPending}
                              className='pl-10'
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className='w-full h-fit relative'>
                            <span className='absolute top-1/2 -translate-y-1/2 left-2.5'>
                              <LockKeyholeOpenIcon className='size-4 text-indigo-500' />
                            </span>
                            <span
                              onClick={() => setShowPassword((prev) => !prev)}
                              className='absolute top-1/2 -translate-y-1/2 right-3'
                            >
                              {showPassword ? (
                                <>
                                  <EyeIcon className='size-4 text-indigo-500' />
                                </>
                              ) : (
                                <>
                                  <EyeOffIcon className='size-4 text-indigo-500' />
                                </>
                              )}
                            </span>

                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder='Enter correct password'
                              {...field}
                              disabled={isPending || loading}
                              className='pl-10'
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {errMesg && (
                    <p className='w-full bg-destructive/10 rounded-md py-2 px-4 text-sm text-rose-300 shadow-lg'>
                      {errMesg}
                    </p>
                  )}
                  <Button
                    disabled={
                      loading || oauthGithubLoading || oauthGoogleLoading
                    }
                    type='submit'
                    className='w-full mt-5'
                  >
                    {loading || isPending ? "Logging " : "LOG "} IN
                    <ChevronRightIcon />
                  </Button>
                </form>
              </Form>
            </CardContent>
            <p className='text-center text-sm font-medium text-muted-foreground'>
              Or, Continue With
            </p>
            <CardFooter className='flex flex-col'>
              <div className='w-full flex items-center gap-2.5'>
                <Button
                  type='button'
                  onClick={() => handleSocialSignIn("google")}
                  variant={"outline"}
                  className='flex-1'
                >
                  {oauthGoogleLoading ? (
                    <LoaderIcon className='animate-spin' />
                  ) : (
                    <FcGoogle />
                  )}
                  Google
                </Button>
                <Button
                  type='button'
                  onClick={() => handleSocialSignIn("github")}
                  variant={"outline"}
                  className='flex-1'
                >
                  {oauthGithubLoading ? (
                    <LoaderIcon className='animate-spin' />
                  ) : (
                    <FaGithub />
                  )}
                  GitHub
                </Button>
              </div>
              <div className='w-fit ml-auto text-sm mt-5'>
                <Link
                  className='ml-auto hover:text-indigo-400 hover:underline'
                  href={"/sign-up"}
                >
                  Don&apos;t have an Account?
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </Container>
    </div>
  );
};
