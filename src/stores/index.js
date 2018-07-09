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

        localStorage.setItem('uid', data.id);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (err) {
        console.log(err)
      }
    }),

    signIn: flow(function* (data, fn) {
      try {
        const result = yield emailSignin(data);
        localStorage.setItem('token', result.data.result.token);
        self.loadCurrentUser();
        fn && fn(result);
      } catch (err) {
        console.log(err);
      }
    }),

    afterCreate() {
      self.loadCurrentUser()
    }
  }));