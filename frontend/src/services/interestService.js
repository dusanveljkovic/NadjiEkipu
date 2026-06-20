// Author: Dusan Veljkovic 23/0417

import apiFetch from "./api";

export const getInterests = async () => {
  return await apiFetch('/interests/')
}


