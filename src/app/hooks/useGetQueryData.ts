import { useEffect, useState } from 'react';

export const useGetQueryData = (results) => {
    const [cards, setCards] = useState([]);
    const [ok, setOk] = useState(false);
    const isEmpty = cards.length === 0;
    
    useEffect(() => {
        if (results) {
          setCards(results);
          setOk(true);
        }
      }, [results]);
    
    return {isEmpty, ok, cards, setCards};
    };