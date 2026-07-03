//
// Napisao Dusan Veljkovic 2023/0417
//

import apiFetch from "./api";

// Dohvati chetove korisnika
export const getUserChats = async () => {
  return await apiFetch('/user-chats/')
}

// Dohvati chat sa porukama i detaljima po id
export const getFullChat = async (id) => {
  return await apiFetch(`/chats/${id}`)
}
