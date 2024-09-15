'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { randomPage } from './utils/randomPage';

import Buttons from '../app/components/buttons/Buttons';
import Loading from './components/loading/Loading';
import CardsCommon from './components/cards-common/CardsCommon';

import { useGetQueryData } from '@/app/hooks/useGetQueryData';

import { Characters } from './gql/queries/types/Characters';
import { CHARACTERS } from './gql/queries/Character.query';

export default function Home() {
  const { data, loading, error, fetchMore } = useQuery<Characters>(CHARACTERS, {
    variables: {
      page: randomPage,
    },
    errorPolicy: 'all',
  });
  const results = data?.characters?.results;
  const { isEmpty, ok, cards, setCards } = useGetQueryData(results);
  const [animDirection, setAnimDirection] = useState('');
  const [id, setId] = useState(null);

  useEffect(() => {
    if (results) {
      setId(results[0].id);
    }
    console.log('mounted');
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
    removeCard();
  };

  const interactCard = (type: 'skip' | 'like'): void => {
    console.log('type', type);
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

  const nextRandomPage = data?.characters?.info?.next;
  const handleLoadMore = () => {
    fetchMore({
      variables: {
        page: nextRandomPage,
      },
    })
      .then((res) => {
        setCards([...res.data.characters.results]);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  if (loading) {
    return <Loading />;
  }
  if (error) return <p>Error :(</p>;
  return (
    <div className="content w-full h-full">
      {!isEmpty && ok && (
        <>
          <div className="content__cards relative w-full h-[50vh]">
            <CardsCommon cards={cards} id={id} animDirection={animDirection} />
          </div>
          <Buttons interactCard={interactCard} />
        </>
      )}
      {isEmpty && ok && (
        <div className="h-[50vh] flex flex-col justify-center items-center gap-4">
          <p>This is it! Load more?</p>
          <button
            className="border bg-slate-300 py-2 px-4 rounded-lg"
            onClick={() => handleLoadMore()}
          >
            Yes, please!
          </button>
        </div>
      )}
    </div>
  );
}
