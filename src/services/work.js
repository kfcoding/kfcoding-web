import request from '../utils/request';
import API from "../utils/api";

export function getWork(work_id) {
  return request(API + '/works/' + work_id);
}

export function doWork(data) {
  return request(API + '/submissions', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  });
}