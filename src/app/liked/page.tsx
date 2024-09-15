'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { CHARACTERS_BY_ID } from '../gql/queries/CharactersById';

import Card from '../components/card/Card';
import Loading from '../components/loading/Loading';

export default function Page() {
  const [characters, setCharacters] = useState([]);
  const [cards, setCards] = useState([]);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const favArr = localStorage.getItem('favourites')
      ? JSON.parse(localStorage.getItem('favourites'))
      : [];
    const favArrUnique = Array.from(new Set(favArr));
    setCharacters(favArrUnique);
  }, []);

  const { data, loading, error } = useQuery(CHARACTERS_BY_ID, {
    variables: {
      ids: [...characters],
    },
    errorPolicy: 'all',
  });
  const results = data?.charactersByIds;

  useEffect(() => {
    if (results) {
      setCards(results);
      setOk(true);
    }
  }, [results]);

  if (loading) {
    return <Loading />;
  }
  if (characters.length === 0) return <p>There is no liked characters yet.</p>;

  if (error) return <p>Error :(</p>;
  return (
    <div className="liked">
      <p className="text-center mb-5">
        Total liked characters: {characters.length}
      </p>
      <div className="content relative w-full h-full flex flex-wrap gap-4 justify-center">
        {cards &&
          ok &&
          cards
            .map((character) => (
              <Card
                key={character?.id}
                characterData={character}
                isStatic={true}
              />
            ))
            .reverse()}
      </div>
    </div>
  );
}
