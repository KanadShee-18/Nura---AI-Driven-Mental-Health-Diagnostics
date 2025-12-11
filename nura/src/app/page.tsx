import { Footer } from "@/components/common/footer";
import { LandingFeatures } from "@/components/hero/landing-features";
import { LandingHero } from "@/components/hero/landing-section";

export default function Home() {
  return (
    <main className='relative'>
      <div className='fixed -z-10 inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#22252b_1px,transparent_1px)] bg-size-[16px_16px]' />

      <div className='fixed inset-0 -z-5 h-full w-full bg-linear-to-br from-teal-400/40 via-transparent to-cyan-400/45 mask-b-from-0% mask-t-from-20% rotate-45 scale-200'></div>

      <LandingHero />
      <LandingFeatures />
      <Footer />
    </main>
  );
}
