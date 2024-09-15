import Image from 'next/image';
import loading from './images/loading.svg';

const Loading = (): JSX.Element => {
  return (
    <div className="loading relative flex justify-center items-center w-full h-[50vh]">
      <div className="loading__image w-40 origin-center animate-spin">
        <Image src={loading} alt="Loading Rick's head" />
      </div>
    </div>
  );
};
export default Loading;
