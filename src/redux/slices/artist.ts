import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
// utils
import axios from '../../utils/axios';
// @types
import { Artist, ArtistLabel } from '../../@types/artist';

// ----------------------------------------------------------------------

function objFromArray(array: any[], key = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

type ArtistState = {
  isLoading: boolean;
  error: boolean;
  artists: {
    byId: Record<string, Artist>;
    allIds: string[];
  };
  labels: ArtistLabel[];
};

const initialState: ArtistState = {
  isLoading: false,
  error: false,
  artists: { byId: {}, allIds: [] },
  labels: []
};

const slice = createSlice({
  name: 'artist',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET LABELS
    getLabelsSuccess(state, action) {
      state.isLoading = false;
      state.labels = action.payload;
    },

    // GET MAILS
    getArtistsSuccess(state, action) {
      const artists = action.payload;

      state.isLoading = false;
      state.artists.byId = objFromArray(artists);
      state.artists.allIds = Object.keys(state.artists.byId);
    },

    // GET MAIL
    getArtistSuccess(state, action) {
      const artist = action.payload;

      state.artists.byId[artist.id] = artist;
      if (!state.artists.allIds.includes(artist.id)) {
        state.artists.allIds.push(artist.id);
      }
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getLabels() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/artist/labels');
      dispatch(slice.actions.getLabelsSuccess(response.data.labels));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getArtists(params: Record<string, string>) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/artist/artists', { params });
      dispatch(slice.actions.getArtistsSuccess(response.data.artists));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getArtist(artistId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/artist/artist', {
        params: { artistId }
      });
      dispatch(slice.actions.getArtistSuccess(response.data.artist));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
