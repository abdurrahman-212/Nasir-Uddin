const API_BASE = '/api';

export async function fetchApi(endpoint: string, options: any = {}) {
  const token = localStorage.getItem('adminToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('adminToken');
    }
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  login: (data: any) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  
  getBlogs: () => fetchApi('/blogs'),
  createBlog: (data: any) => fetchApi('/blogs', { method: 'POST', body: JSON.stringify(data) }),
  deleteBlog: (id: number) => fetchApi(`/blogs/${id}`, { method: 'DELETE' }),
  
  getGallery: () => fetchApi('/gallery'),
  createGallery: (data: any) => fetchApi('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  deleteGallery: (id: number) => fetchApi(`/gallery/${id}`, { method: 'DELETE' }),
  
  getSettings: () => fetchApi('/settings'),
  updateSettings: (data: any) => fetchApi('/settings', { method: 'POST', body: JSON.stringify(data) }),
};
