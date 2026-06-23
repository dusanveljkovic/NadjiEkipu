// Author: Dusan Veljkovic 23/0417

import apiFetch from "./api";

export const getInterests = async () => {
  return await apiFetch('/interests/')
}

export const addInterest = async (form) => {
  return await apiFetch('/interests/add-interest/', {
    method: 'POST',
    body: JSON.stringify(form)
  })
}

export const getUserInterests = async () => {
  return await apiFetch('/user-interests/')
}

export const addUserInterest = async (interest_id) => {
  return await apiFetch('/user-interests/', {
    method: 'POST',
    body: JSON.stringify({ interest_id: interest_id, skill_level: 1 })
  })
}

export const updateUserInterest = async (id, skillLevel) => {
  return await apiFetch(`/user-interests/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ skill_level: skillLevel })
  })
}

export const deleteUserInterest = async (id) => {
  return await apiFetch(`/user-interests/${id}`, {
    method: 'DELETE'
  })
}

