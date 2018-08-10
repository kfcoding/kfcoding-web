import request from '../utils/request';
import API from "../utils/api";

export function createTerminalWorkSpace(data) {
  return request(API + '/workspaces/terminal', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function createWorkSpace(data) {
  return request(API + '/workspaces', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function getWorkspaceByUser() {
  return request(API + '/workspaces');
}

export function deleteWorkspace(id) {
  return request(API + '/workspaces/'+id, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'DELETE',
  });
}

export function keepWorkSpace(containerName, type) {
  return request(API + "/workspaces/keep?containerName=" + containerName + "&type=" + type)
}

