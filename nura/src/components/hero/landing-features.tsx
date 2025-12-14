"use client";

import {
  Zap,
  Lock,
  ClipboardCheck,
  MessageCircle,
  TrendingUp,
  Building2,
} from "lucide-react";
import { Container } from "../common/container";
import { motion } from "motion/react";

const features = [
  {
    id: "instant-ai-analysis",
    title: "Instant AI Analysis",
    icon: Zap,
    description:
      "Powered by Random Forest & Semi-Supervised Learning algorithms to detect patterns invisible to the human eye.",
  },
  {
    id: "anonymous-privacy",
    title: "100% Anonymous",
    icon: Lock,
    description:
      "We don't ask for your name or ID to start. Your data is processed securely and your privacy is our priority.",
  },
  {
    id: "treatment-recommendations",
    title: "Treatment Recommendations",
    icon: ClipboardCheck,
    description:
      "Don't just get a label. Get a clear 'Yes/No' recommendation on whether you should seek professional treatment.",
  },
  {
    id: "real-time-support",
    title: "Real-Time Support",
    icon: MessageCircle,
    description:
      "Feeling overwhelmed? Connect instantly with our support chat or find resources near you immediately.",
  },
  {
    id: "progress-tracking",
    title: "Progress Tracking",
    icon: TrendingUp,
    description:
      "Save your history. Watch how your mental health evolves over time with our secure user dashboard.",
  },
  {
    id: "corporate-ready",
    title: "Corporate Ready",
    icon: Building2,
    description:
      "Designed for individuals and workplaces. Assess employee burnout risk before it becomes a crisis.",
  },
];

export const LandingFeatures = () => {
  return (
    <motion.section id='features' className='py-12 md:py-20'>
      <div className='bg-linear-to-b from-white/40  dark:from-black/20 to-transparent backdrop-blur-xs pt-10 pb-24'>
        <Container className='container mx-auto px-4'>
          <motion.h2
            initial={{ opacity: 0, scale: 0.97, filter: "blur(7px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            viewport={{ once: true }}
            className='text-2xl sm:text-3xl md:text-4xl text-center font-semibold tracking-tight text-transparent bg-linear-to-br dark:from-blue-50 from-blue-500 via-cyan-500 to-teal-500 dark:to-slate-300 bg-clip-text py-5 text-shadow-xs'
          >
            Why Trust Our Diagnostics?
          </motion.h2>
          <motion.div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 mt-10'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 * index,
                  // ease: "easeOut",
                }}
                className='p-6 border relative dark:border-zinc-800 border-zinc-300 rounded-none shadow-inner shadow-black/10 dark:shadow-white/5 bg-linear-to-br from-zinc-200/10 dark:from-zinc-900/10 via-transparent to-neutral-400/20 dark:to-neutral-900/20 backdrop-blur-sm text-card-foreground max-w-sm mx-auto md:max-w-md transition-all duration-300 ease-in-out opacity-70 hover:opacity-100'
              >
                <span className='size-3 absolute border-b-[0.5px] border-r-[0.5px] border-slate-500/40 dark:border-slate-400/40 -left-3 -top-3'></span>
                <span className='size-3 absolute border-l-[0.5px] border-b-[0.5px] border-slate-500/40 dark:border-slate-400/40 -right-3 -top-3'></span>
                <span className='size-3 absolute border-t-[0.5px] border-r-[0.5px] border-slate-500/40 dark:border-slate-400/40 -left-3 -bottom-3'></span>
                <span className='size-3 absolute border-t-[0.5px] border-l-[0.5px] border-slate-500/40 dark:border-slate-400/40 -right-3 -bottom-3'></span>
                <div className='flex flex-row gap-x-3 items-center text-transparent bg-linear-to-r from-cyan-500 dark:to-slate-300 to-slate-500 dark:via-teal-300 via-teal-500 bg-clip-text'>
                  <feature.icon className='size-7 mb-4 dark:text-cyan-400 text-cyan-500' />
                  <h3 className='text-lg md:text-xl font-semibold mb-2 w-fit'>
                    {feature.title}
                  </h3>
                </div>
                <p className='dark:text-zinc-300 text-zinc-500 font-medium text-sm ml-10'>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </div>
    </motion.section>
  );
};
