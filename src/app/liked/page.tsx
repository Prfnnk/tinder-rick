'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import Card from '../components/card/Card';

// import { Characters } from '../gql/queries/types/Characters';
// import { CHARACTERS } from '../gql/queries/Character.query';

import { gql } from '@apollo/client';

const CHARACTERS_BY_ID = gql`
  query CharactersById($ids: [ID!]!) {
    charactersByIds(ids: $ids) {
      id
      name
      species
      status
      location {
        name
      }
      image
    }
  }
`;

export default function Page() {
  const [characters, setCharacters] = useState([]);
  const [cards, setCards] = useState([]);
  const [ok, setOk] = useState(false);
  useEffect(() => {
    //TODO: make it global + add load more and pages layout
    const favArr = localStorage.getItem('favourites')
      ? JSON.parse(localStorage.getItem('favourites'))
      : [];
    setCharacters(favArr);
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
    return (
      <div className="w-full h-full flex justify-center items-center">
        loading.....
      </div>
    );
  }
  if (error) return <p>Error :(</p>;
  return (
    <div className="liked">
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
