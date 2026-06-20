import apiFetch from "./api";

export const getInterests = async () => {
  return await apiFetch('/interests/')
}



