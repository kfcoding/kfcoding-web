import { types, flow } from 'mobx-state-tree';
import { getMyKongfu } from "../services/users";
import { deleteKongfu } from "../services/kongfu";

export const Book = types
  .model('Book', {
    id: types.string,
    title: types.string
  }).actions(self => ({

  }));

export const BookStore = types
  .model('BookStore', {
    books: types.array(Book)
  }).actions(self => ({
    loadBooks: flow(function*() {
      try {
        const result = yield getMyKongfu();
        self.books = result.data.result.kongfuList;
      } catch (err) {
        console.log(err);
      }
    }),
    removeBook: flow(function*(book) {
      try {
        const result = yield deleteKongfu(book.id);
        for (var i in self.books) {
          if (self.books[i] == book) {
            self.books.splice(i, 1);
            break;
          }
        }
      } catch (err) {
        console.log(err)
      }
    })
  }));