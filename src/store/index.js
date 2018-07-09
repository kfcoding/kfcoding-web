import { types, flow } from 'mobx-state-tree';
import { User } from "./UserStore";
import { currentUser, emailSignin } from "services/users";

export const Store = types
  .model('Store', {
    token: types.optional(types.string, ''),
    currentUser: types.optional(User, {
      id: '',
      email: '',
      name: '',
    }),
  }).actions(self => ({
    loadCurrentUser: flow(function* () {
      try {
        const result = yield currentUser();
        const data = result.data.result.user;
        self.currentUser.id = data.id;
        self.currentUser.email = data.email;
        self.currentUser.name = data.name;
      } catch (err) {
        console.log(err)
      }
    }),

    signIn: flow(function* (data, fn) {
      try {
        const result = yield emailSignin(data);
        fn && fn(result);
      } catch (err) {
        console.log(err);
      }
    }),

    afterCreate() {
      self.loadCurrentUser()
    }
  }));