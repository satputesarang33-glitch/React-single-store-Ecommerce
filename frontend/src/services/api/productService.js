import { apiClient, mockDelay } from './apiClient';
import { initialProducts } from '../../data/products';

class ProductService {
  async getProducts(filters = {}) {
    if (!apiClient.useMock) {
      const queryParams = new URLSearchParams(filters).toString();
      return await apiClient.get(`/products${queryParams ? `?${queryParams}` : ''}`);
    }

    await mockDelay(200);
    let list = [...initialProducts];

    if (filters.category && filters.category !== 'ALL') {
      list = list.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.maxPrice) {
      list = list.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }
    return list;
  }

  async getProductById(id) {
    if (!apiClient.useMock) {
      return await apiClient.get(`/products/${id}`);
    }
    await mockDelay(150);
    return initialProducts.find(p => p.id === id) || null;
  }

  async createProduct(productData) {
    if (!apiClient.useMock) {
      return await apiClient.post('/products', productData);
    }
    await mockDelay(300);
    const newProduct = {
      id: `uc-new-${Date.now()}`,
      inStock: true,
      rating: 5.0,
      reviewsCount: 0,
      ...productData
    };
    return newProduct;
  }

  async updateProduct(id, updateData) {
    if (!apiClient.useMock) {
      return await apiClient.put(`/products/${id}`, updateData);
    }
    await mockDelay(250);
    return { id, ...updateData };
  }

  async deleteProduct(id) {
    if (!apiClient.useMock) {
      return await apiClient.delete(`/products/${id}`);
    }
    await mockDelay(200);
    return { success: true, id };
  }
}

export const productService = new ProductService();
