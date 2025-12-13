"use client";

import { Container } from "@/components/common/container";
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
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";
import {
  EyeIcon,
  EyeOffIcon,
  LockKeyholeOpenIcon,
  MailIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { error } from "console";

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
    setLoading(true);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
    });

    setLoading(false);

    if (error) {
      setErrMesg(error.message ?? "Something went wrong!");
    }
  };

  return (
    <div className=''>
      <Container className='pt-16 px-5 md:px-10 min-h-screen'>
        <div className='flex mt-24 items-center justify-center'>
          <Card className='w-[400px] py-8'>
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
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder='Enter correct password'
                              {...field}
                              disabled={isPending || loading}
                              className='pl-10'
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={isPending || loading}
                    type='submit'
                    className='w-full mt-5'
                  >
                    LOG IN
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
                  <FcGoogle />
                  Google
                </Button>
                <Button
                  type='button'
                  onClick={() => handleSocialSignIn("github")}
                  variant={"outline"}
                  className='flex-1'
                >
                  <FaGithub />
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
