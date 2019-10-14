import { Post } from './requset';
import { userApi } from './api';

// 注册
export async function regist(data) {
  return Post(`${userApi.regist}`, data);
}

export async function login(data) {
  return Post(`${userApi.login}`, data);
}

export async function getUserList() {
  return Post(`${userApi.userList}`);
}

export async function deleteUser(data) {
  return Post(`${userApi.deleteUser}`, data);
}

export async function updateUser(data) {
  return Post(`${userApi.updateUser}`, data);
}
