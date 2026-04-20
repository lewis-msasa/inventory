import { injectable } from "inversify";
import type { CreateOrUpdateProductResponse, ProductDataSource, ProductsQueryParams, ProductsResponse } from "../../../domain/data/products/ProductDataSource";
import type { Product, ProductVariant } from "../../../domain/models/product";

@injectable()
export class ProductDataSourceMock implements ProductDataSource{
    private mockProducts: Product[] = [];
    constructor(){
           this.initMockProducts()
    }
  
    private initMockProducts() {
    const brands = ['Nike', 'Adidas', 'Hoka', 'Saucony', 'Brooks', 'Asics', 'New Balance', 'Puma', 'Under Armour', 'Reebok'];
    const categories = ['Shoe', 'Apparel', 'Accessory', 'Equipment'];
    const tagsList = ['running', 'trail', 'road', 'casual', 'performance', 'winter', 'summer', 'waterproof', 'lightweight'];
    const models = ['Speedster', 'Runner Pro', 'Trail Blazer', 'Road Warrior', 'Comfort Plus', 'Elite', 'Premium', 'Standard'];
    
    // Generate 100 mock products for testing
    for (let i = 1; i <= 100; i++) {
      const brand = brands[i % brands.length];
      const model = `${models[i % models.length]} ${Math.floor(i / 10) + 1}`;
      this.mockProducts.push({
        id: `p${String(i).padStart(4, '0')}`,
        name: `${brand} ${model}`,
        category: categories[i % categories.length],
        brand: brand,
        model: model,
        tags: [
          tagsList[i % tagsList.length],
          tagsList[(i + 5) % tagsList.length],
          tagsList[(i + 10) % tagsList.length]
        ].slice(0, 2),
        variants: [
          {
            id: `v${i}a`,
            size: i % 2 === 0 ? 'M' : 'L',
            color: i % 3 === 0 ? 'Black' : i % 3 === 1 ? 'White' : 'Blue',
            sku: `SKU-${i}${String.fromCharCode(65 + (i % 26))}`,
            costPrice: 50 + (i % 150),
            retailPrice: 100 + (i % 200),
            barcode: `BAR${String(i).padStart(10, '0')}`,
            inventoryItems: []
          },
          {
            id: `v${i}b`,
            size: i % 2 === 0 ? 'L' : 'XL',
            color: i % 3 === 0 ? 'Red' : i % 3 === 1 ? 'Green' : 'Yellow',
            sku: `SKU-${i}${String.fromCharCode(66 + (i % 25))}`,
            costPrice: 55 + (i % 145),
            retailPrice: 110 + (i % 190),
            barcode: `BAR${String(i + 100).padStart(10, '0')}`,
            inventoryItems: []
          }
        ]
      });
    }
  }
    async getProducts(params: ProductsQueryParams): Promise<ProductsResponse> {
         // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Filter products
    let filtered = [...this.mockProducts];

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        p.model.toLowerCase().includes(searchLower)
      );
    }

    if (params.category && params.category !== 'all') {
      filtered = filtered.filter(p => p.category === params.category);
    }

    if (params.brand && params.brand !== 'all') {
      filtered = filtered.filter(p => p.brand === params.brand);
    }

    if (params.tag && params.tag !== 'all') {
      filtered = filtered.filter(p => p.tags.includes(params.tag!!));
    }

    // Sort products
    if (params.sortBy) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        if (params.sortBy === 'name') {
          aValue = a.name || `${a.brand} ${a.model}`;
          bValue = b.name || `${b.brand} ${b.model}`;
        } else if (params.sortBy === 'brand') {
          aValue = a.brand;
          bValue = b.brand;
        } else {
          aValue = a.model;
          bValue = b.model;
        }
        
        if (params.sortOrder === 'desc') {
          return bValue.localeCompare(aValue);
        }
        return aValue.localeCompare(bValue);
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / params.limit);
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    const products = filtered.slice(start, end);

    return {
      products,
      total,
      page: params.page,
      totalPages,
      hasMore: params.page < totalPages
    };
    }
    async createProduct(product: Omit<Product, "id">): Promise<CreateOrUpdateProductResponse> {
           await new Promise(resolve => setTimeout(resolve, 500));
            const newProduct = {
            ...product,
            id: `p${Date.now()}`
            };
            this.mockProducts.unshift(newProduct);
            return {product: newProduct, successful: true};
    }
   async createVariant(productId: string, variant: ProductVariant): Promise<CreateOrUpdateProductResponse> {
       await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockProducts.findIndex(p => p.id === productId);
        if (index === -1) throw new Error('Product not found');
        
        this.mockProducts[index] = { ...this.mockProducts[index], variants: [...this.mockProducts[index].variants, {...variant, id: Date.now().toString()}] };
        return {product: this.mockProducts[index], successful: true};
  }
    async updateProduct(id: string, updates: Partial<Product>): Promise<CreateOrUpdateProductResponse> {
       await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockProducts.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Product not found');
        
        this.mockProducts[index] = { ...this.mockProducts[index], ...updates };
        return {product: this.mockProducts[index], successful: true};
    }
    async deleteProduct(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockProducts.findIndex(p => p.id === id);
        if (index !== -1) {
        this.mockProducts.splice(index, 1);
    }
    }
    async getProductById(id: string): Promise<Product | null> {
         await new Promise(resolve => setTimeout(resolve, 300));
         return this.mockProducts.find(p => p.id === id) || null;
    }
    async getFilterOptions(): Promise<{
        categories: string[];
        brands: string[];
        tags: string[];
      }> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
          categories: [...new Set(this.mockProducts.map(p => p.category))],
          brands: [...new Set(this.mockProducts.map(p => p.brand))],
          tags: [...new Set(this.mockProducts.flatMap(p => p.tags))]
        };
      }

}