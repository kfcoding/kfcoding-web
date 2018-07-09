import { types, flow } from 'mobx-state-tree';
import { createWorkSpace } from "services/workspace";

export const Workspace = types
  .model('Workspace', {
    id: types.string,
    title: types.string
  }).actions(self => ({

  }));

export const WorkspaceStore = types
  .model('WorkspaceStore', {
    workspaces: types.array(Workspace)
  }).actions(self => ({
    createWorkspace: flow(function*() {
      try {
        const result = yield createWorkSpace(data);

      } catch (e) {
        console.log(e)
      }
    })
  }));