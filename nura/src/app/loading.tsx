import { LoaderIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <LoaderIcon className='animate-spin' />
    </div>
  );
};
export default Loading;
