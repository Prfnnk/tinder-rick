import { gql } from '@apollo/client';

const CHARACTERS = gql`
  query Characters($page: Int) {
    characters(page: $page) {
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

export { CHARACTERS };
