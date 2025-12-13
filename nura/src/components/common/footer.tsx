"use client";

import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { Container } from "./container";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Testimonials", href: "#" },
      { label: "Integration", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Case Studies", href: "#" },
      { label: "Support", href: "#" },
      { label: "Documentation", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className='py-14 border-t bg-background text-foreground'>
      <Container className='px-5 md:px-10'>
        <div className='flex flex-col lg:flex-row gap-10 lg:gap-20'>
          <div className='lg:w-1/4'>
            <BrandLogo className='w-8' />
            <p className='mt-4 text-muted-foreground text-sm'>
              Empowering mental wellness through AI-driven insights and secure,
              anonymous support.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 flex-1'>
            {footerSections.map((section) => (
              <div key={section.title} className='flex flex-col gap-4'>
                <h3 className='font-semibold text-foreground'>
                  {section.title}
                </h3>
                <ul className='flex flex-col gap-2'>
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className='text-muted-foreground hover:text-cyan-500 transition-colors text-sm'
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-10 pt-6 border-t text-center text-sm text-muted-foreground'>
          <p>&copy; 2025 Nura. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};
