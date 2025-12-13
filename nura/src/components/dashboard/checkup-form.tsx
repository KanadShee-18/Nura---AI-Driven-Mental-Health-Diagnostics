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
      age: 24,
      gender: "Male",
      family_history: "No",
      yoga: "No",
      self_employed: "No",
      work_interfere: "Never",
      care_options: "Not sure",
      mental_health_interview: "No",
      mental_health_consequence: "No",
      leave: "Somewhat easy",
      benefits: "Don't know",
    },
  });

  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const onSubmit = async (values: MentalHealthFormData) => {
    console.log("Button pressed");
    console.log(values);

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
    <Card className='p-6 max-w-md lg:max-w-lg mx-auto shadow-2xl'>
      <h2 className='text-2xl font-semibold text-transparent bg-clip-text bg-linear-to-r dark:from-blue-50 from-blue-500 dark:via-blue-100 via-teal-600 dark:to-slate-200 to-slate-600'>
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
            {/* Age */}
            <FormField
              control={form.control}
              name='age'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    What's Your Age?
                  </p>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter your age'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {/* Family History */}
            <FormField
              control={form.control}
              name='family_history'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Is there any family history related to mental health?
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

            {/* Yoga */}
            <FormField
              control={form.control}
              name='yoga'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Do you practice Yoga for better mental health?
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
            {/* Self Employed */}
            <FormField
              control={form.control}
              name='self_employed'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Are you Self Employed (work from office/home)?
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

            {/* Work Interfere */}
            <FormField
              control={form.control}
              name='work_interfere'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    How often you feel mental health issue while working?
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select option' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Often'>Often</SelectItem>
                      <SelectItem value='Rarely'>Rarely</SelectItem>
                      <SelectItem value='Never'>Never</SelectItem>
                      <SelectItem value='Sometimes'>Sometimes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {/* Care Options */}
            <FormField
              control={form.control}
              name='care_options'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Availing any mental health care from your work station?
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
                      <SelectItem value='Not sure'>Not sure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='mental_health_interview'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Any Negative Feedback from recent mental health checkup?
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
                      <SelectItem value='Maybe'>Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-10'>
            {/* Mental health consequence */}
            <FormField
              control={form.control}
              name='mental_health_consequence'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Feel any problem while sharing consequences?
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
                      <SelectItem value='Maybe'>Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Leave */}
            <FormField
              control={form.control}
              name='leave'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    How easy it is to take a medical leave?
                  </p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select option' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Very easy'>Very easy</SelectItem>
                      <SelectItem value='Somewhat easy'>
                        Somewhat easy
                      </SelectItem>
                      <SelectItem value='Somewhat difficult'>
                        Somewhat difficult
                      </SelectItem>
                      <SelectItem value='Very difficult'>
                        Very difficult
                      </SelectItem>
                      <SelectItem value="Don't know">Don't know</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {/* Benefits */}
            <FormField
              control={form.control}
              name='benefits'
              render={({ field }) => (
                <FormItem>
                  <p className='text-sm tracking-wide text-shadow-2xs font-medium dark:text-neutral-200'>
                    Does your employer provide mental health benefits?
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
                      <SelectItem value="Don't know">Don't know</SelectItem>
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
