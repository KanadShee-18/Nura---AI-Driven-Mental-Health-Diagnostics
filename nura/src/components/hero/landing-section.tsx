"use client";

import Link from "next/link";
import { Container } from "../common/container";
import { TestimonialImage } from "./testimonial-image";
import { motion } from "motion/react";

export const LandingHero = () => {
  return (
    <section id='landing-hero' className='pt-14 md:pt-20'>
      <Container className='px-5 md:px-10 flex flex-col gap-y-7 items-center justify-center pt-10'>
        <motion.h2
          initial={{ opacity: 0, filter: "blur(7px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
          viewport={{ once: true }}
          className='text-2xl sm:text-4xl md:text-6xl text-center font-semibold tracking-tight text-transparent bg-linear-to-br dark:from-blue-50 from-blue-500 via-cyan-600 dark:via-blue-100 dark:to-blue-200 to-teal-700 bg-clip-text'
        >
          Understand Your Mind. <br /> Uncover Your Path to Wellness
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, filter: "blur(7px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: "easeInOut",
          }}
          viewport={{ once: true }}
          className='text-center font-medium text-slate-600/80 dark:text-slate-300/80 text-shadow-sm max-w-xl'
        >
          Mental health shouldn&apos;t be a guessing game. Our advanced AI
          analyzes your patterns to provide a preliminary diagnostic assessment
          and treatment recommendation in under 2 minutes. No waiting lists,
          just clarity.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, filter: "blur(7px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.5,
            ease: "easeInOut",
          }}
          viewport={{ once: true }}
        >
          <Link
            href={"/dashboard"}
            className='scale-110 relative bg-linear-to-br dark:from-slate-700 from-slate-200 via-secondary to-neutral-300 dark:to-neutral-800 hover:rounded-[3px] transition-all duration-300 ease-in-out opacity-90 hover:opacity-100 group px-5 py-2.5 rounded-md dark:text-white text-black border text-shadow-2xs'
          >
            <span className='absolute inset-x-0 bottom-0 h-px w-1/2 group-hover:w-4/5 bg-linear-to-r from-transparent dark:via-primary via-cyan-400 to-transparent mx-auto' />
            Start Your Assessment
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, filter: "blur(7px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.7,
            ease: "easeInOut",
          }}
          viewport={{ once: true }}
        >
          <TestimonialImage />
        </motion.div>
      </Container>
    </section>
  );
};
