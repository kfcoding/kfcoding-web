import { types, flow } from 'mobx-state-tree';
import { BookStore } from "./BookStore";

export const User = types
  .model('User', {
    id: types.string,
    email: types.string,
    name: types.string,
    bookStore: types.optional(BookStore, {
      books: []
    })
  }).actions(self => ({
    setToken(token) {
      self.token = token;
    }
  }));

export const UserStore = types
  .model('UserStore', {
  });