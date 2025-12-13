import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { CartService } from '../../services/cart.service';
import { IProducts, IBrand, ICategory } from '../../../core/interfaces/interface.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: IProducts[] = [];
  filteredProducts: IProducts[] = [];
  brands: IBrand[] = [];
  categories: ICategory[] = [];
  loading = true;
  
  selectedBrand: number | null = null;
  selectedCategory: number | null = null;
  searchTerm = '';
  sortBy = 'name';
  currentPage = 1;
  itemsPerPage = 12;

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadBrands();
    this.loadCategories();
    
    // Check query params
    this.route.queryParams.subscribe(params => {
      if (params['brand']) {
        this.selectedBrand = +params['brand'];
      }
      if (params['category']) {
        this.selectedCategory = +params['category'];
      }
      this.filterProducts();
    });
  }

  loadProducts(): void {
    this.apiService.getProducts().subscribe({
      next: (response: any) => {
        const products = response.data?.rows || response.data || response || [];
        this.products = products;
        this.filterProducts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  loadBrands(): void {
    this.apiService.getBrands().subscribe({
      next: (response: any) => {
        this.brands = response.data || response || [];
      },
      error: (error) => {
        console.error('Error loading brands:', error);
      }
    });
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || response || [];
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  filterProducts(): void {
    let filtered = [...this.products];

    // Filter by brand
    if (this.selectedBrand) {
      filtered = filtered.filter(p => p.brand_id == this.selectedBrand);
    }

    // Filter by category
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category_id == this.selectedCategory);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.perfume_name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.brand?.brand_name.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.perfume_name.localeCompare(b.perfume_name);
      }
    });

    this.filteredProducts = filtered;
    this.currentPage = 1;
  }

  onBrandChange(brandId: number | null): void {
    this.selectedBrand = brandId;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { brand: brandId || null },
      queryParamsHandling: 'merge'
    });
    this.filterProducts();
  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: categoryId || null },
      queryParamsHandling: 'merge'
    });
    this.filterProducts();
  }

  onSearch(): void {
    this.filterProducts();
  }

  onSortChange(): void {
    this.filterProducts();
  }

  addToCart(product: IProducts): void {
    
    this.cartService.addToCart(product, 1).subscribe({
      next: () => {
        alert('Product added to cart!');
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart');
      }
    });
  }

  getProductImage(imageUrl: string | undefined): string {
    if (imageUrl) return imageUrl;
    return 'https://via.placeholder.com/300x300?text=Perfume';
  }

  get paginatedProducts(): IProducts[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
