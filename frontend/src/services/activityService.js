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

export const createActivity = async (data) => {
  const formattedData = {
    interest_id: parseInt(data.interest_id),
    title: data.title,
    description: data.description || '',
    event_time: `${data.date} ${data.time}:00`,
    location_name: data.location,
    max_participants: parseInt(data.max_participants),
    indoor: data.indoor ? 1 : 0,
    lat: data.lat || null,
    lon: data.lon || null
  }

  return await apiFetch('/activities/', {
    method: 'POST',
    body: JSON.stringify(formattedData)
  })
}

export const deleteActivity = async (id) => {
  return await apiFetch(`/activities/${id}/`, {
    method: 'DELETE'
  })
}

export const joinActivity = async (id) => {
  return await apiFetch(`/activities/${id}/join`, {
    method: 'POST'
  })
}

export const leaveActivity = async (id) => {
  return await apiFetch(`/activities/${id}/leave`, {
    method: 'POST'
  })
}
