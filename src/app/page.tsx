'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import Card from '../app/components/card/Card';
import Buttons from '../app/components/buttons/Buttons';

import { Characters } from './gql/queries/types/Characters';
import { CHARACTERS } from './gql/queries/Character.query';

export default function Home() {
  const { data, loading, error, fetchMore } = useQuery<Characters>(CHARACTERS, {
    variables: {
      page: 1,
    },
    errorPolicy: 'all',
  });
  const [cards, setCards] = useState([]);
  const [ok, setOk] = useState(false);
  // const [refetch, setRefetch] = useState(false);
  const [animDirection, setAnimDirection] = useState('');
  const [id, setId] = useState(null);
  // const [favourites, setFavourites] = useState(0);
  const results = data?.characters?.results;
  const isEmpty = cards.length === 0;

  useEffect(() => {
    if (results) {
      setCards(results);
      setId(results[0].id);
      setOk(true);
      // const favArr = localStorage.getItem('favourites')
      //   ? JSON.parse(localStorage.getItem('favourites'))
      //   : [];
      // setFavourites(favArr.length);
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
    // setFavourites(favouritesArr.length);
    removeCard();
  };

  const interactCard = (type: 'skip' | 'like'): void => {
    if (type === 'skip') {
      setAnimDirection('-translate-x-10 opacity-0');
      setTimeout(() => {
        removeCard();
        setAnimDirection('');
      }, 500);
    } else {
      setAnimDirection('translate-x-10 opacity-0');
      setTimeout(() => {
        addToFavourites();
        setAnimDirection('');
      }, 500);
    }
  };

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        page: 2,
      },
    })
      .then((res) => {
        console.log('res', res);
        setCards([...res.data.characters.results]);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        loading.....
      </div>
    );
  }
  if (error) return <p>Error :(</p>;
  return (
    <main className="main w-full h-full flex flex-col justify-center items-center">
      <div className="content">
        {!isEmpty && ok && (
          <>
            <div className="content__cards relative w-full h-[50vh]">
              {cards &&
                cards
                  .map((character) => (
                    <Card
                      key={character?.id}
                      characterData={character}
                      animDirection={character?.id === id ? animDirection : ''}
                    />
                  ))
                  .reverse()}
            </div>
            <Buttons interactCard={interactCard} />
          </>
        )}
        {isEmpty && ok && (
          <div>
            <p>This is it! Load more?</p>
            <button onClick={() => handleLoadMore()}>Yes, please!</button>
          </div>
        )}
      </div>
    </main>
  );
}
