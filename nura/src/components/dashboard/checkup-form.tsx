"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";

import { mentalHealthSchema } from "@/lib/schemas";
import type { MentalHealthFormData } from "@/lib/schemas";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ChevronRightIcon, LoaderIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { healthCheckUp } from "@/actions/health-checkup-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const CheckUpForm = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [errMesg, setErrMesg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    condition: string;
    treatment: string;
  } | null>(null);

  const form = useForm<MentalHealthFormData>({
    resolver: zodResolver(mentalHealthSchema),
    defaultValues: {
      gender: "Male",
      occupation: "Corporate",
      selfEmployed: "Yes",
      faceDailyProblem: "Yes",
      familyHistory: "No",
      pastHistory: "Maybe",
      spendIndoors: "1-14 Days",
      habitChange: "Maybe",
      increasingStressLevel: "Maybe",
      sociallyWeak: "No",
      findInterestInWork: "Maybe",
      takenMentalHealthInterview: "No",
      awareAboutCareOption: "No",
    },
  });

  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const onSubmit = async (values: MentalHealthFormData) => {
    setResult(null);
    setErrMesg(null);
    setLoading(true);

    const res = await healthCheckUp(values, userId);

    if (!res.success) {
      toast.error("Some error occurred while check up!");
      setErrMesg(res.message);
    } else {
      if (res.data) {
        setResult(res.data);
        toast.success("Check Up done successfully!");

        timeoutRef.current = setTimeout(() => {
          setResult(null);
          router.push("/dashboard");
          router.refresh();
        }, 5000);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Card className='p-6 md:my-10 my-5 max-w-md lg:max-w-lg mx-auto shadow-2xl'>
      <h2 className='text-2xl font-semibold text-transparent bg-clip-text bg-linear-to-r dark:from-blue-300 from-blue-500 dark:via-teal-400 via-teal-600 dark:to-slate-300 to-slate-600'>
        Mental Well-Being Assessment
      </h2>
      {result && (
        <div className='flex flex-col gap-y-2.5'>
          <p>{result.condition}</p>
          <p>{result.treatment}</p>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {/* Gender Field */}
            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Specify Your Gender
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select gender' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Male'>Male</SelectItem>
                      <SelectItem value='Female'>Female</SelectItem>
                      <SelectItem value='Other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Occupation */}
            <FormField
              control={form.control}
              name='occupation'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    What is your Occupation?
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select Occupation' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Student'>Student</SelectItem>
                      <SelectItem value='Corporate'>Corporate</SelectItem>
                      <SelectItem value='Business'>Business</SelectItem>
                      <SelectItem value='Housewife'>Housewife</SelectItem>
                      <SelectItem value='Others'>Others</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {/* Self Employed */}
            <FormField
              control={form.control}
              name='selfEmployed'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200 h-10 lg:h-auto'>
                    Are you Self-Employed?
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select option' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Yes'>Yes</SelectItem>
                      <SelectItem value='No'>No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Face Daily Problem */}
            <FormField
              control={form.control}
              name='faceDailyProblem'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200 h-10 lg:h-auto'>
                    Struggle with daily problems?
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select option' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Yes'>Yes</SelectItem>
                      <SelectItem value='No'>No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-10'>
            {/* Family History */}
            <FormField
              control={form.control}
              name='familyHistory'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    In your family does anyone face mental health issues?
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select option' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Yes'>Yes</SelectItem>
                      <SelectItem value='No'>No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Past History */}
            <FormField
              control={form.control}
              name='pastHistory'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Any past history of mental health issues?
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select option' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Yes'>Yes</SelectItem>
                      <SelectItem value='No'>No</SelectItem>
                      <SelectItem value='Maybe'>Maybe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-10'>
            {/* Spend Indoors */}
            <FormField
              control={form.control}
              name='spendIndoors'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    How many days do you typically stay in indoors?
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select option' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='1-14 Days'>1-14 Days</SelectItem>
                      <SelectItem value='15-30 Days'>15-30 Days</SelectItem>
                      <SelectItem value='31-60 Days'>31-60 Days</SelectItem>
                      <SelectItem value='More than 2 Months'>
                        More than 2 Months
                      </SelectItem>
                      <SelectItem value='Go out Every day'>
                        Go Out Everyday
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Change in Habit */}
            <FormField
              control={form.control}
              name='habitChange'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Noticed any significant changes in your habits?
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select option' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Yes'>Yes</SelectItem>
                      <SelectItem value='No'>No</SelectItem>
                      <SelectItem value='Maybe'>Maybe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {/* Increasing Stress Level */}
            <FormField
              control={form.control}
              name='increasingStressLevel'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Do you feel your stress levels are increasing?
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select option' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Yes'>Yes</SelectItem>
                      <SelectItem value='No'>No</SelectItem>
                      <SelectItem value='Maybe'>Maybe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Socially Weak */}
            <FormField
              control={form.control}
              name='sociallyWeak'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Do you feel socially weak or isolated?
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select option' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Yes'>Yes</SelectItem>
                      <SelectItem value='No'>No</SelectItem>
                      <SelectItem value='Maybe'>Maybe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-10'>
            {/* Interest in work */}
            <FormField
              control={form.control}
              name='findInterestInWork'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Do you find any interest in your work?
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select option' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Yes'>Yes</SelectItem>
                      <SelectItem value='No'>No</SelectItem>
                      <SelectItem value='Maybe'>Maybe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Mental Health Interview */}
            <FormField
              control={form.control}
              name='takenMentalHealthInterview'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Part of any mental health–related interview ever?
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select option' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Yes'>Yes</SelectItem>
                      <SelectItem value='No'>No</SelectItem>
                      <SelectItem value='Maybe'>Maybe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <FormField
              control={form.control}
              name='awareAboutCareOption'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Are you aware about your mental health care options?
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select option' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Yes'>Yes</SelectItem>
                      <SelectItem value='No'>No</SelectItem>
                      <SelectItem value='Not Sure'>Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {result && (
            <motion.div
              key='result'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='space-y-6'
            >
              <div className='p-4 rounded-lg bg-green-500/10 border border-green-500/40 flex items-start gap-3'>
                <CheckCircle2 className='w-5 h-5 text-green-500 mt-0.5' />
                <div>
                  <h4 className='font-semibold text-green-700 dark:text-green-400'>
                    Analysis Complete
                  </h4>
                  <p className='text-sm text-green-600/90 dark:text-green-400/90 mt-1'>
                    Based on your inputs, our model predict that, you have:{" "}
                    {result.condition}
                  </p>
                </div>
              </div>

              <div className='space-y-3'>
                <h4 className='text-sm font-medium text-muted-foreground'>
                  Analysis
                </h4>
                <div className='space-y-2'>
                  <div className='flex items-center gap-3 p-3 rounded-md bg-muted/50 border'>
                    <span className='text-sm'>Treatment Needed: </span>
                    <div className='w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500'>
                      {result.treatment}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {errMesg && (
            <motion.div
              key='error'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='space-y-6'
            >
              <div className='p-4 rounded-lg bg-rose-500/10 border border-rose-500/40 flex items-start gap-3'>
                <CheckCircle2 className='w-5 h-5 text-rose-400 mt-0.5' />
                <div>
                  <p className='text-sm text-rose-600/90 dark:text-rose-400/90 mt-1'>
                    {errMesg}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <Button
            disabled={loading}
            type='submit'
            className='w-full mt-5 group'
          >
            {loading ? "Checking" : "CHECK"} UP
            {loading ? (
              <LoaderIcon className='animate-spin' />
            ) : (
              <ChevronRightIcon className='group-hover:translate-x-1.5 duration-300 ease-in-out' />
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
};
