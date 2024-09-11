import Image from 'next/image';

const Card = ({ characterData }) => {
  return (
    <div className="card absolute left-[calc(50%_-_10rem)] top-0 w-80 h-[50vh] border flex rounded-2xl last-of-type:shadow-md">
      <div className="card__image rounded-2xl overflow-hidden absolute inset-0 bg-slate-200">
        <Image
          width={400}
          height={400}
          src={characterData?.image}
          alt={characterData?.name}
        />
      </div>
      <div className="card__info rounded-b-2xl overflow-hidden w-full p-4 mt-auto relative z-10 border-t bg-white">
        <p className="card__info-title font-bold">
          <span className="card__info-name text-lg">
            {characterData?.name},{' '}
          </span>
          <span className="card__info-species text-base">
            {characterData?.species}
          </span>
        </p>
        <p className="card__location mt-3">{characterData?.location.name}</p>
      </div>
    </div>
  );
};
export default Card;
