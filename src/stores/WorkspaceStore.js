import { types, flow } from 'mobx-state-tree';
import { createWorkSpace, deleteWorkspace, createContainer } from "services/workspace";

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
    createWorkspace: flow(function*(data) {
      // self.createContainer(data.image);
      try {
        // const result = yield createContainer(data.image);
        // data.containerName = result.data.name;

        const result1 = yield createWorkSpace(data);
        self.workspaces.push({
          id: result1.data.result.workspace.id,
          title: result1.data.result.workspace.title
        })
      } catch (e) {
        console.log(e)
      }
    }),
    removeWorkspace: flow(function*(workspace) {
      try {
        const result = yield deleteWorkspace(workspace.id);
        self.workspaces.remove(workspace);
      } catch (e) {
        console.log(e)
      }
    })
  }));