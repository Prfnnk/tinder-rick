import Card from '@/app/components/card/Card';

interface CardsCommonProps {
  cards: {
    id: number;
    image: string;
    name: string;
    species: string;
    location: { name: string };
  }[];
  id?: number;
  animDirection?: string;
  isStatic?: boolean;
}

const CardsCommon = ({
  cards,
  id = 0,
  animDirection = '',
  isStatic = false,
}: CardsCommonProps) => {
  return (
    <>
      {cards &&
        cards
          .map((character) => (
            <Card
              key={character?.id}
              characterData={character}
              animDirection={character?.id === id ? animDirection : ''}
              isStatic={isStatic}
            />
          ))
          .reverse()}
    </>
  );
};
export default CardsCommon;
