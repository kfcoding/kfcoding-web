import request from '../utils/request';
import API from "../utils/api";

export function createCourse(data) {
  return request(API + '/courses', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function getCourse(course_id) {
  return request(API + '/courses/' + course_id);
}

export function createWork(data) {
  return request(API + '/works', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updateWork(data) {
  return request(API + '/works', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function joinCourse(code) {
  return request(API + '/courses/join?code=' + code);
}

/**
 * 获取自己加入的课程列表
 */
export function getMyJoinedCourses() {
  return request(API + '/students/current');
}