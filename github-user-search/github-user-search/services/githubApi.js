import axios from 'axios';

const GITHUB_API_BASE_URL = 'https://api.github.com';

/**
 * Searches for GitHub users by username and optional advanced criteria.
 * @param {string} username - The username to search for.
 * @param {string} location - Optional location filter.
 * @param {number} minRepos - Optional minimum public repository count filter.
 * @returns {Promise<object>} - A promise that resolves with the API response data.
 */
export const fetchUserData = async (username, location, minRepos) => {
  try {
    // If only a username is provided, use the single-user endpoint.
    if (username && !location && !minRepos) {
      const response = await axios.get(`${GITHUB_API_BASE_URL}/users/${username}`);
      return { items: [response.data] }; // Wrap the single user in an array to maintain consistent data structure.
    }

    // Otherwise, use the advanced search endpoint.
    let query = `q=${username}`;
    if (location) {
      query += `+location:${location}`;
    }
    if (minRepos) {
      query += `+repos:>=${minRepos}`;
    }

    const response = await axios.get(`${GITHUB_API_BASE_URL}/search/users?${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data from GitHub API:", error);
    throw error;
  }
};
