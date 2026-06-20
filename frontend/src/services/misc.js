import apiFetch from "./api";

export const getCities = async () => {
  return await apiFetch('/cities/')
}
