"use client";

import type { CheckUp } from "@/generated/prisma/client";
import {
  CalendarIcon,
  Grid2x2PlusIcon,
  LifeBuoyIcon,
  StethoscopeIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const DashboardHistory = ({ data }: { data: CheckUp[] }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<CheckUp | null>(null);

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7 lg:gap-10 px-7'>
        {data.map((checkUp, index) => (
          <div
            key={checkUp.id}
            onClick={() => {
              setSelected(checkUp);
              setOpen(true);
            }}
            className='p-6 relative cursor-pointer dark:border-zinc-800 border-zinc-300 rounded-sm dark:shadow-2xl shadow-sm shadow-black/10 dark:shadow-white/5 bg-linear-to-br from-zinc-200/10 dark:from-zinc-900/10 via-transparent to-neutral-400/20 dark:to-neutral-900/20 backdrop-blur-sm text-card-foreground transition-all duration-300 ease-in-out flex flex-col'
          >
            <p className='text-[11px] absolute top-0 right-0 px-2 py-0.5 tracking-wider  bg-linear-to-r dark:from-teal-500 from-teal-600 dark:to-slate-700 to-slate-500  text-white text-shadow-2xs rounded-bl-sm rounded-tr-sm w-fit border-b ml-auto'>
              ID: {checkUp.id}
            </p>
            <div className='dark:text-neutral-300 text-cyan-500 font-medium text-sm flex items-center gap-x-3 mt-3'>
              <span className='flex font-medium tracking-wide items-center gap-x-1 dark:text-blue-300 text-blue-500'>
                {" "}
                <CalendarIcon className='size-3.5' /> Date:
              </span>{" "}
              <p className='text-sm tracking-wide'>
                {checkUp.createdAt.toLocaleString()}
              </p>
            </div>
            <div className='dark:text-neutral-300 text-cyan-500 text-sm flex items-center gap-x-3 mt-1'>
              <span className='dark:text-blue-300 text-blue-500 font-medium tracking-wide flex items-center gap-x-1'>
                <LifeBuoyIcon className='size-3.5' /> Condition:
              </span>{" "}
              <p className='text-sm text-shadow-2xs'>{checkUp.condition}</p>
            </div>
            <div className='dark:text-neutral-300 text-cyan-500 text-sm flex items-center gap-x-3 mt-1'>
              <span className='dark:text-blue-300 text-blue-500 flex items-center gap-x-1 font-medium tracking-wide'>
                <Grid2x2PlusIcon className='size-3.5' /> Treatment Needed:
              </span>{" "}
              <p className='text-sm'>{checkUp.treatment}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className='flex items-center gap-x-2 text-teal-500'>
                  <StethoscopeIcon />
                  Checkup Details
                </DialogTitle>
              </DialogHeader>

              <div className='space-y-2 text-sm'>
                <p>
                  <strong>Checkup ID:</strong> {selected.id}
                </p>
                <p>
                  <strong>Date:</strong> {selected.createdAt.toLocaleString()}
                </p>
                <p>
                  <strong>Condition:</strong> {selected.condition}
                </p>
                <p>
                  <strong>Treatment:</strong> {selected.treatment}
                </p>
                <p>
                  <strong>Age:</strong> {selected.age}
                </p>
                <p>
                  <strong>Gender:</strong> {selected.gender}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
export default DashboardHistory;
