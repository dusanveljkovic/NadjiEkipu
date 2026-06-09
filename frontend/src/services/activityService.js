import apiFetch from "./api";

export const getActivities = async () => {
  return await apiFetch('/activities/')
}

export const getActivityById = async (id) => {
  return await apiFetch(`/activities/${id}/`)
}


