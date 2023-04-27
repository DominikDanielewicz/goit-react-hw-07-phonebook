import { createSlice } from '@reduxjs/toolkit';
import Notiflix from 'notiflix';
import { fetchContacts, addContact, deleteContact } from './operations';

const handlePending = state => {
  state.isLoading = true;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    contacts: [],
    isLoading: false,
    error: null,
  },
  extraReducers: {
    [fetchContacts.pending]: handlePending,
    [addContact.pending]: handlePending,
    [deleteContact.pending]: handlePending,
    [fetchContacts.rejected]: handleRejected,
    [addContact.rejected]: handleRejected,
    [deleteContact.rejected]: handleRejected,
    [fetchContacts.fulfilled](state, action) {
      state.isLoading = false;
      state.error = null;
      state.contacts = action.payload;
    },
    [addContact.fulfilled](state, action) {
      state.isLoading = false;
      state.error = null;
      const names = state.contacts.map(contact => contact.name);
      const newContactName = action.payload.name;
      if (
        !names.find(name => name.toLowerCase() === newContactName.toLowerCase())
      ) {
        state.contacts.push(action.payload);
        Notiflix.Notify.success(
          `Contact with name '${newContactName}' has been added succesfully to contacts list.`
        );
      } else {
        Notiflix.Notify.failure(
          `Contact with name '${newContactName}' is already in contacts.`
        );
      }
    },
    [deleteContact.fulfilled](state, action) {
      state.isLoading = false;
      state.error = null;
      const index = state.contacts.findIndex(
        contact => contact.contactId === action.payload.contactId
      );
      state.contacts.splice(index, 1);
    },
  },
});

export const contactsReducer = contactsSlice.reducer;
