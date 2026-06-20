// Author: Dusan Veljkovic 23/0417

import apiFetch from "./api";

export const getUserChats = async () => {
  return await apiFetch('/user-chats/')
}

export const getFullChat = async (id) => {
  return await apiFetch(`/chats/${id}`)
}
