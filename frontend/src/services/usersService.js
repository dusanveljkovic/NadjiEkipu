// Author: Jana Jolovic 23/0338

import apiFetch from "./api";

export const getUsers = async () => {
  return await apiFetch('/users/')
}

export const getUserById = async (id) => {
  return await apiFetch(`/users/${id}/`)
}

export const deleteUser = async (id) => {
  return await apiFetch(`/users/${id}/`, {
    method: "DELETE",
  });
};

export const getModeratorRequests = async () => {
  return await apiFetch("/moderator-requests/");
};

export const getModeratorRequestById = async (id) => {
  return await apiFetch(`/moderator-requests/${id}/`);
};

export const updateModeratorRequest = async (id, status) => {
  return await apiFetch(`/moderator-requests/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const createModeratorRequest = async () => {
  return await apiFetch("/moderator-requests/", {
    method: "POST",
  });
};
