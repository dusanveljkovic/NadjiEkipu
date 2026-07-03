//
// Napisao Dusan Veljkovic 2023/0417
//

import apiFetch from "./api";

// Dohvati sva interesovanja
export const getInterests = async () => {
  return await apiFetch('/interests/')
}

// Dodaj interesovanje
export const addInterest = async (form) => {
  return await apiFetch('/interests/add-interest/', {
    method: 'POST',
    body: JSON.stringify(form)
  })
}

// Dohvati sva interesovanja korisnika
export const getUserInterests = async () => {
  return await apiFetch('/user-interests/')
}

// Dodaj interesovanje korisniku
export const addUserInterest = async (interest_id) => {
  return await apiFetch('/user-interests/', {
    method: 'POST',
    body: JSON.stringify({ interest_id: interest_id, skill_level: 1 })
  })
}

// Promeni skill level interesovanja korisnika
export const updateUserInterest = async (id, skillLevel) => {
  return await apiFetch(`/user-interests/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ skill_level: skillLevel })
  })
}

// Obrisi interesovanje korisnika
export const deleteUserInterest = async (id) => {
  return await apiFetch(`/user-interests/${id}`, {
    method: 'DELETE'
  })
}

