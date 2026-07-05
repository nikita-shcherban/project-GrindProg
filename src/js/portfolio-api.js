import axios from 'axios';

const LIMIT_IMAGE_PER_PAGE = 9;

export async function getCategories() {
  const response = await axios.get(
    'https://wedding-photographer.b.goit.study/api/categories'
  );
  return response.data;
}

export async function getWeddingPhotos(
  categories = undefined,
  page = 1,
  limit = LIMIT_IMAGE_PER_PAGE
) {
  const response = await axios.get(
    'https://wedding-photographer.b.goit.study/api/wedding-photos',
    {
      params: {
        page: page,
        limit: limit,
        categoryId: categories,
      },
    }
  );
  return response.data;
}
