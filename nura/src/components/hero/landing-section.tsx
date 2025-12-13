"use client";

import Image from "next/image";
import { Container } from "../common/container";
import { Button } from "../ui/button";
import { TestimonialImage } from "./testimonial-image";
import Link from "next/link";

export const LandingHero = () => {
  return (
    <section id='landing-hero' className='pt-14'>
      <Container className='px-5 md:px-10 flex flex-col gap-y-6 items-center justify-center pt-10'>
        <h2 className='text-2xl sm:text-4xl md:text-6xl text-center font-semibold tracking-tight text-transparent bg-linear-to-br dark:from-blue-50 from-blue-500 via-cyan-600 dark:via-blue-100 dark:to-blue-200 to-teal-700 bg-clip-text'>
          Understand Your Mind. <br /> Uncover Your Path to Wellness
        </h2>
        <p className='text-center font-medium text-slate-600/80 dark:text-slate-300/80 text-shadow-sm max-w-xl'>
          Mental health shouldn&apos;t be a guessing game. Our advanced AI
          analyzes your patterns to provide a preliminary diagnostic assessment
          and treatment recommendation in under 2 minutes. No waiting lists,
          just clarity.
        </p>
        <Link
          href={"/dashboard"}
          className='scale-110 bg-linear-to-br from-primary via-cyan-600 to-teal-600 hover:rounded-[3px] transition-all duration-300 ease-in-out opacity-90 hover:opacity-100 px-5 py-2 rounded-md'
        >
          Start Your Assessment
        </Link>
        <TestimonialImage />
      </Container>
    </section>
  );
};
