import axios from 'axios';

const API_KEY = '43229178-92086ef52b57e39ce4e68da2d';
const DEFAULT_PER_PAGE = 15;

export async function fetchImages(query, page = 1) {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${DEFAULT_PER_PAGE}`;

  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }
    return response.data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}