import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CartService } from '../../services/cart.service';
import { IProducts, IBrand, ICategory } from '../../../core/interfaces/interface.model';

@Component({
  selector: 'app-main-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './main-component.component.html',
  styleUrl: './main-component.component.css'
})
export class MainComponentComponent implements OnInit {
  featuredProducts: IProducts[] = [];
  brands: IBrand[] = [];
  categories: ICategory[] = [];
  loading = true;

  constructor(
    private apiService: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadBrands();
    this.loadCategories();
  }

  loadFeaturedProducts(): void {
    this.apiService.getProducts().subscribe({
      next: (response: any) => {
        const products = response.data?.rows || response.data || response || [];
        // Get first 8 products as featured
        this.featuredProducts = products.slice(0, 8);
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

  addToCart(product: IProducts): void {
    console.log(product)
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
}
