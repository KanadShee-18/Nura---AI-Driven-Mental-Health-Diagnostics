"use client";

import { IconLayoutSidebar, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { BrandLogo as Logo } from "./brand-logo";
import { Container } from "./container";
import { ToggleTheme } from "./theme-toggler";

const NavLinks = [
  {
    title: "Features",
    href: "/#features",
    id: "nav-features",
  },
  {
    title: "Try it Out",
    href: "/#tryitout",
    id: "nav-tryitout",
  },
  // {
  //   title: "Products",
  //   href: "/#products",
  //   id: "nav-products",
  // },
  // {
  //   title: "Socials",
  //   href: "/#footer",
  //   id: "nav-socials",
  // },
  // {
  //   title: "Pricing",
  //   href: "/#pricing",
  //   id: "nav-pricing",
  // },
];

const AuthNavLinks = [
  {
    title: "Login",
    href: "/sign-in",
    id: "auth-signin",
  },
  {
    title: "Signup",
    href: "/sign-up",
    id: "auth-signup",
  },
];

export const Navbar = () => {
  return (
    <div className='border-b border-neutral-200 dark:border-neutral-800 fixed w-full top-0 backdrop-blur-2xl z-9999'>
      <DesktopNavbar />
      <MobileNavbar />
    </div>
  );
};

const MobileNavbar = () => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);

  return (
    <div className='md:hidden flex items-center justify-between px-4 py-2 font-display relative'>
      <Logo className='w-5' />
      <button
        className='cursor-pointer'
        type='button'
        onClick={() => setOpenSidebar(true)}
      >
        <IconLayoutSidebar className='size-4 mr-5' />
      </button>
      <AnimatePresence>
        {openSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              backdropFilter: "blur(15px)",
              background: "black",
            }}
            exit={{
              opacity: 0,
              backdropFilter: "blur(0px)",
              background: "rgba(255, 255, 255, 0.5)",
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className='fixed inset-0 z-50 max-h-screen min-h-screen  w-full overflow-hidden'
          >
            <div className='px-4 py-2 h-full relative'>
              <div className='flex justify-between border-b border-neutral-200 dark:border-neutral-800 pb-1'>
                <Logo className='w-6' />
                <button
                  className='cursor-pointer'
                  type='button'
                  onClick={() => setOpenSidebar(false)}
                >
                  <IconX className='size-4 mr-2' />
                </button>
              </div>
              <div className='flex flex-col gap-y-6 pt-5'>
                {NavLinks.map((navItem, index) => (
                  <motion.div
                    initial={{ x: -5, y: -2 }}
                    animate={{ x: 0, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    key={navItem.id}
                  >
                    <Link
                      href={navItem.href}
                      className='font-medium text-xl text-shadow-2xs hover:opacity-75'
                    >
                      {navItem.title}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className='w-full mt-10'>
                <div className='flex items-center gap-x-3 w-fit ml-auto mr-4'>
                  {AuthNavLinks.map((authLink, index) => (
                    <motion.div
                      initial={{ x: 5, y: 5 }}
                      animate={{ x: 0, y: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.07,
                      }}
                      key={authLink.id}
                    >
                      <Link href={authLink.href}>
                        <Button size={"sm"}>{authLink.title}</Button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DesktopNavbar = () => {
  return (
    <Container className='py-2 md:flex hidden items-center justify-between font-inter px-5 md:px-8'>
      <Logo />
      <div className='flex items-center gap-x-3.5 md:gap-x-4 lg:gap-x-6'>
        {NavLinks.map((navItem) => (
          <Link
            href={navItem.href}
            key={navItem.id}
            className='text-sm font-medium text-neutral-600 dark:text-neutral-200 hover:opacity-80'
          >
            <span>{navItem.title}</span>
          </Link>
        ))}
      </div>
      <div className='flex items-center gap-x-3.5'>
        <ToggleTheme />
        {AuthNavLinks.map((authLink) => (
          <Link href={authLink.href} key={authLink.id}>
            <Button size={"sm"}>{authLink.title}</Button>
          </Link>
        ))}
      </div>
    </Container>
  );
};
