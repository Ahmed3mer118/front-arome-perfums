import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { CartService } from '../../../services/cart.service';
import { IProducts } from '../../../../core/interfaces/interface.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: IProducts | null = null;
  loading = true;
  quantity = 1;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('routeProduct');
    if (productId) {
      this.loadProduct(+productId);
    }
  }

  loadProduct(id: number): void {
    this.apiService.getProduct(id).subscribe({
      next: (response: any) => {
        this.product = response.data || response;
        if (this.product) {
          this.selectedImage = this.getProductImage(this.product.image_url);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    });
  }

  getProductImage(imageUrl: string | undefined): string {
    if (imageUrl) return imageUrl;
    return 'https://via.placeholder.com/600x600?text=Perfume';
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity).subscribe({
        next: () => {
          alert('Product added to cart!');
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          alert('Failed to add product to cart');
        }
      });
    }
  }

  buyNow(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity).subscribe({
        next: () => {
          this.router.navigate(['/checkout']);
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          alert('Failed to add product to cart');
        }
      });
    }
  }
}
