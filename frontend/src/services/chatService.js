// Author: Dusan Veljkovic 23/0417

import apiFetch from "./api";

export const getMyChats = async () => {
  return await apiFetch('/chats/')
}
