import request from '../utils/request';
import API from "../utils/api";

export function createSubmission(data) {
  return request(API + '/submissions', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  });
}
