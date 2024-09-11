'use client';

import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';

import Card from '../app/components/card/Card';
import Buttons from '../app/components/buttons/Buttons';

import { Characters } from './gql/queries/types/Characters';

const CHARACTERS = gql`
  query Characters(
    $page: Int
    $name: String
    $gender: String
    $species: String
    $status: String
  ) {
    characters(
      page: $page
      filter: {
        name: $name
        gender: $gender
        species: $species
        status: $status
      }
    ) {
      info {
        count
        pages
        next
      }
      results {
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
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery<Characters>(CHARACTERS, {
    variables: {
      page: 1,
    },
    errorPolicy: 'all',
  });
  const [cards, setCards] = useState([]);
  const [ok, setOk] = useState(false);
  // const [refetch, setRefetch] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [id, setId] = useState(null);
  const [favourites, setFavourites] = useState(0);
  const results = data?.characters?.results;
  const isEmpty = cards.length === 0;

  useEffect(() => {
    if (results) {
      setCards(results);
      setId(results[0].id);
      setOk(true);
      const favArr = localStorage.getItem('favourites')
        ? JSON.parse(localStorage.getItem('favourites'))
        : [];
      setFavourites(favArr.length);
    }
  }, [results]);

  useEffect(() => {
    if (cards && results && ok) {
      if (cards.length < results.length) {
        setId(cards[0]?.id ?? '');
      }
    }
  }, [cards, results, ok]);

  const removeCard = () => {
    const filtered = cards.filter((item) => item.id !== id);
    setCards(filtered);
  };

  const addToFavourites = () => {
    let favouritesArr = [];
    favouritesArr = JSON.parse(localStorage.getItem('favourites')) || [];
    favouritesArr.push(id);

    localStorage.setItem('favourites', JSON.stringify([...favouritesArr]));
    setFavourites(favouritesArr.length);
    console.log('favourites', favouritesArr);
    removeCard();
  };

  const interactCard = (type: 'skip' | 'like'): void => {
    if (type === 'skip') {
      removeCard();
      console.log('skip');
    } else {
      console.log('like');
      addToFavourites();
    }
  };

  if (loading) {
    return <div>loading.....</div>;
  }
  if (error) return <p>Error :(</p>;
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="flex justify-between w-full">
        <p>restart</p>
        <p>liked ({favourites})</p>
        <p>matched</p>
      </header>
      <main className="w-full h-full flex flex-col justify-center items-center">
        <div className="content w-full h-full">
          {!isEmpty && ok && (
            <>
              <div className="content__cards relative w-full h-full">
                {cards &&
                  cards
                    .map((character) => (
                      <Card
                        isInteracting={isInteracting}
                        key={character?.id}
                        characterData={character}
                      />
                    ))
                    .reverse()}
              </div>
              <Buttons interactCard={interactCard} />
            </>
          )}
          {isEmpty && ok && <div>Load more?</div>}
        </div>
      </main>
    </div>
  );
}
