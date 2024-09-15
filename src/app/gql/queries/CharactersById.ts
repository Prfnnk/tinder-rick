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

export { CHARACTERS_BY_ID };