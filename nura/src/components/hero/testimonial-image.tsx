"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle2,
  RefreshCw,
  BrainCircuit,
  Activity,
  Calendar,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "input" | "processing" | "result";

export const TestimonialImage = () => {
  const [step, setStep] = useState<Step>("input");
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [workDays, setWorkDays] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (!selectedAge || !selectedGender || !workDays) return;
    setStep("processing");
    setTimeout(() => {
      setStep("result");
    }, 2000);
  };

  const handleReset = () => {
    setStep("input");
    setSelectedAge(null);
    setSelectedGender(null);
    setWorkDays(null);
  };

  return (
    <div id='tryitout' className='relative w-full max-w-md mx-auto mt-10'>
      {/* Decorative background elements */}
      <div className='absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl' />
      <div className='absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl' />

      <Card className='relative overflow-hidden border-primary/10 shadow-sm dark:shadow-xl backdrop-blur-sm bg-card/95'>
        <CardHeader>
          <div className='flex items-center gap-2 mb-1'>
            <div className='p-2 rounded-lg bg-primary/10 text-primary'>
              <BrainCircuit className='w-5 h-5' />
            </div>
            <span className='text-xs font-medium text-primary uppercase tracking-wider'>
              AI Assessment
            </span>
          </div>
          <CardTitle>Wellness Check</CardTitle>
          <CardDescription>Instant analysis powered by Nura AI</CardDescription>
        </CardHeader>

        <CardContent className='min-h-[300px]'>
          <AnimatePresence mode='wait'>
            {step === "input" && (
              <motion.div
                key='input'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className='space-y-6'
              >
                <div className='space-y-3'>
                  <label className='text-sm font-medium flex items-center gap-2 text-muted-foreground'>
                    <User className='w-4 h-4' /> Age Group
                  </label>
                  <div className='flex flex-wrap gap-2'>
                    {["18-24", "25-34", "35-44", "45+"].map((age) => (
                      <button
                        key={age}
                        onClick={() => setSelectedAge(age)}
                        className={cn(
                          "px-3 py-1.5 text-sm rounded-full border transition-all",
                          selectedAge === age
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background hover:bg-muted border-input"
                        )}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='space-y-3'>
                  <label className='text-sm font-medium flex items-center gap-2 text-muted-foreground'>
                    <Activity className='w-4 h-4' /> Current Stress Level
                  </label>
                  <div className='flex flex-wrap gap-2'>
                    {["Low", "Moderate", "High"].map((gender) => (
                      <button
                        key={gender}
                        onClick={() => setSelectedGender(gender)}
                        className={cn(
                          "px-3 py-1.5 text-sm rounded-full border transition-all",
                          selectedGender === gender
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background hover:bg-muted border-input"
                        )}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='space-y-3'>
                  <label className='text-sm font-medium flex items-center gap-2 text-muted-foreground'>
                    <Calendar className='w-4 h-4' /> Work Days / Week
                  </label>
                  <div className='grid grid-cols-3 gap-2'>
                    {["1-3 Days", "4-5 Days", "6+ Days"].map((days) => (
                      <button
                        key={days}
                        onClick={() => setWorkDays(days)}
                        className={cn(
                          "px-2 py-2 text-sm rounded-md border transition-all text-center",
                          workDays === days
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background hover:bg-muted border-input"
                        )}
                      >
                        {days}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === "processing" && (
              <motion.div
                key='processing'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className='flex flex-col items-center justify-center h-[300px] space-y-4'
              >
                <div className='relative'>
                  <div className='absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse' />
                  <Loader2 className='w-12 h-12 text-primary animate-spin relative z-10' />
                </div>
                <div className='text-center space-y-1'>
                  <h3 className='font-semibold text-lg'>Analyzing Patterns</h3>
                  <p className='text-sm text-muted-foreground'>
                    Processing your inputs...
                  </p>
                </div>
              </motion.div>
            )}

            {step === "result" && (
              <motion.div
                key='result'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='space-y-6'
              >
                <div className='p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3'>
                  <CheckCircle2 className='w-5 h-5 text-green-500 mt-0.5' />
                  <div>
                    <h4 className='font-semibold text-green-700 dark:text-green-400'>
                      Analysis Complete
                    </h4>
                    <p className='text-sm text-green-600/90 dark:text-green-400/90 mt-1'>
                      Based on your inputs, your burnout risk appears to be
                      manageable.
                    </p>
                  </div>
                </div>

                <div className='space-y-3'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Recommended Actions
                  </h4>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-3 p-3 rounded-md bg-muted/50 border'>
                      <div className='w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500'>
                        1
                      </div>
                      <span className='text-sm'>Schedule a 15-min break</span>
                    </div>
                    <div className='flex items-center gap-3 p-3 rounded-md bg-muted/50 border'>
                      <div className='w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500'>
                        2
                      </div>
                      <span className='text-sm'>Practice mindfulness</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter>
          {step === "input" && (
            <Button
              className='w-full'
              onClick={handleAnalyze}
              disabled={!selectedAge || !selectedGender || !workDays}
            >
              Generate Analysis
            </Button>
          )}
          {step === "result" && (
            <Button variant='outline' className='w-full' onClick={handleReset}>
              <RefreshCw className='w-4 h-4 mr-2' /> Start New Assessment
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
