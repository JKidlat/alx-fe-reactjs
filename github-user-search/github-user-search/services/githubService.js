export const searchUsers = async (query) => {
  const url = `https://api.github.com/search/users?q=${query}`;
  const headers = {};
  if (import.meta.env.VITE_APP_GITHUB_API_KEY) {
    headers.Authorization = `token ${import.meta.env.VITE_APP_GITHUB_API_KEY}`;
  }
  const response = await axios.get(url, { headers });
  return response.data.items;
};
