//
// Napisala Jana Jolovic 2023/0338
//
import apiFetch from "./api";

// Dohvati sve korisnike
export const getUsers = async () => {
  return await apiFetch('/users/')
}

// Dohvati korisnika putem id
export const getUserById = async (id) => {
  return await apiFetch(`/users/${id}/`)
}

// Obrisi korisnika putem id
export const deleteUser = async (id) => {
  return await apiFetch(`/users/${id}/`, {
    method: "DELETE",
  });
};

// Dohvati sve zahteve za moderatora
export const getModeratorRequests = async () => {
  return await apiFetch("/moderator-requests/");
};

// Dohvati zahtev za moderatora putem id
export const getModeratorRequestById = async (id) => {
  return await apiFetch(`/moderator-requests/${id}/`);
};

// Promeni status zahtevu za moderatora
export const updateModeratorRequest = async (id, status) => {
  return await apiFetch(`/moderator-requests/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

// Kreiraj zahtev za moderatora
export const createModeratorRequest = async () => {
  return await apiFetch("/moderator-requests/", {
    method: "POST",
  });
};
