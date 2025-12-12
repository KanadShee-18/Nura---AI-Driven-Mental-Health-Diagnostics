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
  ChevronRightIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderIcon,
  LockKeyholeOpenIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const signUpSchema = z
  .object({
    name: z.string({ error: "Please provide your name" }),
    email: z.email({ error: "Please provide a valid email" }),
    password: z
      .string({ error: "Password is required to login" })
      .min(6, { error: "Password should be min 6 chars" })
      .max(32, { error: "Password should be max 32 chars" }),
    confirmPassword: z
      .string({ error: "Confirm Password is required to login" })
      .min(6, { error: "Confirm Password should be min 6 chars" })
      .max(32, { error: "Confirm Password should be max 32 chars" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Both password has to be same",
    path: ["confirmPassword"],
  });

export const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [errMesg, setErrMesg] = useState<string | null>(null);
  const [successMesg, setSuccessMesg] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isPending = form.formState.isSubmitting;

  const onFormSubmit = async (values: z.infer<typeof signUpSchema>) => {
    if (!values.name || !values.password || !values.email) return;
    if (values.password.trim() !== values.confirmPassword.trim()) return;

    setSuccessMesg(null);
    setErrMesg(null);
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: "/email-verified",
    });

    if (error) {
      form.reset();
      setErrMesg(error.message ?? "Something went wrong. Try again!");
    } else {
      toast.success("Signed Up Successfully!");
      // router.push("/dashboard");
      setSuccessMesg("Verification email sent successfully!");
    }
  };

  return (
    <div className=''>
      <Container className='pt-16 px-5 md:px-10 min-h-screen'>
        <div className='flex mt-24 items-center justify-center'>
          <Card className='w-md py-8'>
            <CardHeader>
              <h3 className='text-3xl font-semibold'>Become a Part of Nura</h3>
              <p className='text-sm text-muted-foreground font-medium'>
                Check Up Your Mental Health Instantly
              </p>
            </CardHeader>
            <CardContent className='mt-5'>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onFormSubmit)}
                  className='space-y-6'
                >
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <div className='w-full h-fit relative'>
                            <span className='absolute top-1/2 -translate-y-1/2 left-2.5'>
                              <UserIcon className='size-4 text-indigo-500' />
                            </span>
                            <Input
                              type='text'
                              placeholder='Enter your name'
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
                              placeholder='Provide a valid email'
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
                          <FormControl>
                            <Input
                              placeholder='Enter a strong password'
                              type='password'
                              {...field}
                              disabled={isPending}
                              className='pl-10'
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>

                        <FormControl>
                          <div className='w-full h-fit relative'>
                            <span className='absolute top-1/2 -translate-y-1/2 left-2.5 size-5'>
                              <LockKeyholeOpenIcon className='size-4 text-indigo-500' />
                            </span>

                            <Input
                              placeholder='Revalidate your password'
                              type='password'
                              {...field}
                              disabled={isPending}
                              className='pl-10 relative'
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
                  {successMesg && (
                    <p className='w-full bg-emerald-500/10 rounded-md py-2 px-4 text-sm text-emerald-400 shadow-lg'>
                      {successMesg}
                    </p>
                  )}
                  <Button
                    disabled={isPending}
                    type='submit'
                    className='w-full mt-5'
                  >
                    {isPending ? (
                      <>
                        Signing...
                        <LoaderIcon className='animate-spin' />
                      </>
                    ) : (
                      <>
                        SIGN UP
                        <ChevronRightIcon />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <p className='text-center text-sm font-medium text-muted-foreground'>
              Or, Continue With
            </p>
            <CardFooter className='flex flex-col'>
              <div className='w-full flex items-center gap-2.5'>
                <Button variant={"outline"} className='flex-1'>
                  <FcGoogle />
                  Google
                </Button>
                <Button variant={"outline"} className='flex-1'>
                  <FaGithub />
                  GitHub
                </Button>
              </div>
              <div className='w-fit ml-auto text-sm mt-5'>
                <Link
                  className='ml-auto hover:text-indigo-400 hover:underline'
                  href={"/sign-in"}
                >
                  Already part of Nura?
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </Container>
    </div>
  );
};
