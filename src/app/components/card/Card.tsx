import Image from 'next/image';

interface CardProps {
  characterData: {
    image: string;
    name: string;
    species: string;
    location: { name: string };
  };
  animDirection?: string;
  isStatic?: boolean;
}

const Card = ({
  characterData,
  animDirection = '',
  isStatic = false,
}: CardProps): JSX.Element => {
  const positionClass = isStatic
    ? 'relative'
    : 'absolute left-[calc(50%_-_10rem)] top-0 z-10 last-of-type:shadow-md';

  return (
    <div
      className={`${animDirection} ${positionClass} transition card w-80 h-96 border flex rounded-2xl`}
    >
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
        <p className="card__location mt-3">{characterData?.location?.name}</p>
      </div>
    </div>
  );
};
export default Card;
