import request from '../utils/request';
import API from "../utils/api";

export function getUser(uid) {
  if (uid) {
    return request(API + '/users/' + uid);
  }
  if (!localStorage.getItem('user')) {
    return {avatarUrl: null};
  }
  return JSON.parse(localStorage.getItem('user'))
}

// 返回当前用户信息
export function currentUser() {
  return request(API + '/users/current', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });
}

export function getToken(code) {
  return request(API + '/auth?authType=github&credenceCode=' + code);
}

export function getMyKongfu() {
  return request(API + '/users/current/kongfu', {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });
}

// 修改用户信息
export function UpdateUser(user) {
    return request(API + '/users/current', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(user)
    });
    
}

// 邮箱登录
export function emailSignin(data) {
  return request(API + '/auth', {
      headers: {
          'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
  });
}

// 邮箱注册
export function emailSignup(data) {
  return request(API + '/users', {
      headers: {
          'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
  });
}