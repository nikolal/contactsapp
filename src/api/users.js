import { users } from '../../config/url.js';

export const getUsersApi = (perPage, page) => {
  return (
    fetch(`${users}?per_page=${perPage}&&page=${page}`)
      .then(res => res.json())
      .catch(err => err)
  );
};
