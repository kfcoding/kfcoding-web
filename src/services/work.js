import request from '../utils/request';
import API from "../utils/api";

export function getWork(work_id) {
  return request(API + '/works/' + work_id);
}
