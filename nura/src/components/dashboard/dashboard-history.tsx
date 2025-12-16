"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CheckUp } from "@/generated/prisma/client";
import {
  CalendarIcon,
  CircleCheckBigIcon,
  StethoscopeIcon,
} from "lucide-react";
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
            className='p-6 bg-accent/10 dark:bg-accent/20 backdrop-blur-sm rounded-md shadow-xs border-b cursor-pointer hover:bg-accent/30 transition-all duration-200 ease-in-out hover:scale-[0.97] relative overflow-hidden'
          >
            <span className='absolute h-full w-1 bg-linear-to-b from-slate-300 dark:from-slate-600 dark:to-neutral-800 to-neutral-400/70 left-0 inset-y-0 rounded-l-md' />

            <p className='text-[11px] absolute top-0 right-0 px-2 py-0.5 tracking-wider bg-[#ccfbf1] dark:bg-[#003d30] text-emerald-600 dark:text-[#ccfbf1] text-shadow-2xs rounded-bl-sm rounded-tr-sm w-fit border-b ml-auto'>
              ID: {checkUp.id}
            </p>
            <div className='shadow-2xs dark:shadow-xl p-2 rounded-md flex gap-x-3 mt-2'>
              <span className='size-8 bg-blue-200 dark:bg-blue-700 text-blue-500 dark:text-blue-100 flex items-center justify-center rounded-sm shadow-inner'>
                {" "}
                <CalendarIcon className='size-3.5' />
              </span>{" "}
              <div className='flex flex-col'>
                <p className='text-xs font-medium text-muted-foreground dark:text-neutral-300 tracking-wide'>
                  Date:
                </p>
                <p className='text-sm font-medium text-slate-400'>
                  {checkUp.createdAt.toLocaleString()}
                </p>
              </div>
            </div>
            <div className='shadow-2xs dark:shadow-xl p-2 rounded-md flex gap-x-3 mt-2'>
              <span className='size-8 bg-emerald-100 dark:bg-emerald-600 text-emerald-600 dark:text-emerald-100 flex items-center justify-center rounded-sm shadow'>
                {" "}
                <CircleCheckBigIcon className='size-3.5' />
              </span>{" "}
              <div className='flex flex-col'>
                <p className='text-xs dark:text-neutral-300 font-medium text-muted-foreground'>
                  Treatment Needed
                </p>
                <p className='text-sm font-medium text-emerald-500 dark:text-emerald-300/80'>
                  {checkUp.treatment}
                </p>
              </div>
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
                  <strong className='dark:text-slate-300 text-slate-600 tracking-wide'>
                    Checkup ID:
                  </strong>{" "}
                  {selected.id}
                </p>
                <p>
                  <strong className='dark:text-slate-300 text-slate-600 tracking-wide'>
                    Date:
                  </strong>{" "}
                  {selected.createdAt.toLocaleString()}
                </p>
                <p>
                  <strong className='dark:text-slate-300 text-slate-600 tracking-wide'>
                    Treatment or Consultancy Required:
                  </strong>{" "}
                  {selected.treatment}
                </p>
                <p>
                  <strong className='dark:text-slate-300 text-slate-600 tracking-wide'>
                    Gender:
                  </strong>{" "}
                  {selected.gender}
                </p>
                {selected.treatment?.toLowerCase() === "yes" && (
                  <div className='space-y-3 my-5 p-2 bg-accent/30 shadow-sm rounded-md'>
                    <p className='text-sm'>
                      Based on your responses, there may be indicators that
                      professional mental health support could be helpful.
                    </p>
                    <ul className='list-disc pl-5 text-sm text-muted-foreground space-y-1'>
                      <li>Maintain a regular sleep schedule</li>
                      <li>Engage in regular physical activity</li>
                      <li>Manage daily stress through planning and breaks</li>
                      <li>Stay socially connected with friends or family</li>
                      <li>
                        Practice simple relaxation techniques such as deep
                        breathing or mindfulness
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
export default DashboardHistory;
