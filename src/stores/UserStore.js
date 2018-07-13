import { types, flow } from 'mobx-state-tree';
import { BookStore } from "./BookStore";
import { WorkspaceStore } from "./WorkspaceStore";
import { deleteWorkspace, getWorkspaceByUser } from "../services/workspace";

const Student = types
  .model('Student', {
    realName: types.string,
    studentNumber: types.string
  })

export const User = types
  .model('User', {
    id: types.string,
    email: types.string,
    name: types.string,
    role: types.string,
    bookStore: types.optional(BookStore, {
      books: []
    }),
    workspaceStore: types.optional(WorkspaceStore, {
      workspaces: []
    }),
    student: types.optional(Student, {
      realName: '',
      studentNumber: ''
    })
  }).actions(self => ({
    setToken(token) {
      self.token = token;
    },
    loadWorkspaces: flow(function*() {
      const result = yield getWorkspaceByUser();
      self.workspaceStore.workspaces = result.data.result.workspaces;
    }),
    removeWorkspace: flow(function*(workspace) {
      const result = yield deleteWorkspace(workspace.id);
      self.workspaceStore.workspaces.remove(workspace);
    })
  }));

export const UserStore = types
  .model('UserStore', {
  });