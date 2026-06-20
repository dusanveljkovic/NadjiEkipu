// Author: Dusan Veljkovic 23/0417

import apiFetch from "./api";

export const getActivities = async () => {
  return await apiFetch('/activities/')
}

export const getActivityById = async (id) => {
  return await apiFetch(`/activities/${id}/`)
}

export const getUserActivities = async () => {
  return await apiFetch('/user-activities/')
}
