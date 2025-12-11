"use client";

import Image from "next/image";
import { Container } from "../common/container";
import { Button } from "../ui/button";
import { TestimonialImage } from "./testimonial-image";

export const LandingHero = () => {
  return (
    <section id='landing-hero' className='pt-14'>
      <Container className='px-5 md:px-10 flex flex-col gap-y-6 items-center justify-center pt-10'>
        <h2 className='text-2xl sm:text-4xl md:text-6xl text-center font-semibold tracking-tight text-transparent bg-linear-to-br from-blue-50 to-slate-300 bg-clip-text'>
          Understand Your Mind. <br /> Uncover Your Path to Wellness.
        </h2>
        <p className='text-center font-medium text-slate-300/80 text-shadow-2xs max-w-xl'>
          Mental health shouldn&apos;t be a guessing game. Our advanced AI
          analyzes your patterns to provide a preliminary diagnostic assessment
          and treatment recommendation in under 2 minutes. No waiting lists,
          just clarity.
        </p>
        <Button>Start Your Assessment</Button>
        {/* <Image
          src={"/chat.png"}
          alt='chat_image'
          width={500}
          height={500}
          unoptimized
          className='dark:invert w-3/4 lg:w-3/5 xl:w-1/2 h-auto mt-10'
        /> */}
        <TestimonialImage />
      </Container>
    </section>
  );
};
