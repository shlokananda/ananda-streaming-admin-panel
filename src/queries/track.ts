import { gql } from "@apollo/client";

export const GET_ALL_TRACKS = gql`
  {
    mediaMany {
      _id
      title
      artist
      album
      year
      format
      file
    }
  }
`;

//       duration
//       year
//       genre
//       track
//       format
