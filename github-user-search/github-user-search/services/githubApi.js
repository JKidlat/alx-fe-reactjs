import axios from 'axios';

// Get the API key from the environment variable.
// Note: For public GitHub searches, a key is not required,
// but we include this to demonstrate the correct usage pattern.
const GITHUB_API_KEY = import.meta.env.VITE_APP_GITHUB_API_KEY;

const GITHUB_API_BASE_URL = 'https://api.github.com';

/**
 * Searches for GitHub users by username.
 * @param {string} searchTerm - The username to search for.
 * @returns {Promise<object>} - A promise that resolves with the API response data.
 */
export const searchUsers = async (searchTerm) => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE_URL}/search/users`, {
      params: {
        q: searchTerm,
      },
      headers: {
        // We can add the Authorization header here if an API key were needed for a different endpoint.
        // For example: Authorization: `Bearer ${GITHUB_API_KEY}`
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data from GitHub API:", error);
    throw error;
  }
};
