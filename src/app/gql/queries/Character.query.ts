import { gql } from '@apollo/client';

const CHARACTERS = gql`
  query Characters($page: Int) {
    characters(page: $page) {
      info {
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

export { CHARACTERS };
