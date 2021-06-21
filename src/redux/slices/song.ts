import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
// utils
import axios from '../../utils/axios';
import {
  Friend,
  Gallery,
  Profile,
  UserPost,
  Follower,
  CreditCard,
  UserInvoice,
  UserAddressBook,
  NotificationSettings
} from '../../@types/user';
import { Song } from '../../@types/song';

// ----------------------------------------------------------------------

type SongState = {
  isLoading: boolean;
  error: boolean;
  songs: Song[];
  songList: Song[];
};

const initialState: SongState = {
  isLoading: false,
  error: false,
  songs: [],
  songList: []
};

const slice = createSlice({
  name: 'song',
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

    // GET USERS
    getSongsSuccess(state, action) {
      state.isLoading = false;
      state.songs = action.payload;
    },

    // DELETE USERS
    deleteUser(state, action) {
      const deleteUser = filter(state.songList, (song) => song.id !== action.payload);
      state.songList = deleteUser;
    },

    // GET MANAGE SONGS
    getSongListSuccess(state, action) {
      state.isLoading = false;
      state.songList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { deleteUser } = slice.actions;

// ----------------------------------------------------------------------

export function getSongList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/song/manage-songs');
      dispatch(slice.actions.getSongListSuccess(response.data.songList));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getSongs() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/song/all');
      dispatch(slice.actions.getSongsSuccess(response.data.songs));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
