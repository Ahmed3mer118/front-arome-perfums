import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ICartItem } from '../../../core/interfaces/interface.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: ICartItem[] = [];
  total = 0;
  loading = true;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getCartTotal();
      this.loading = false;
    });
    this.subscriptions.push(cartSub);
    
    // Initial load
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getCartTotal();
    this.loading = false;
  }

  updateQuantity(item: ICartItem, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(item);
    } else {
      this.cartService.updateQuantity(item, quantity).subscribe({
        error: (error) => {
          console.error('Error updating quantity:', error);
          alert('Failed to update quantity');
        }
      });
    }
  }

  removeItem(item: ICartItem): void {
    if (confirm('Are you sure you want to remove this item from cart?')) {
      this.cartService.removeFromCart(item).subscribe({
        error: (error) => {
          console.error('Error removing item:', error);
          alert('Failed to remove item');
        }
      });
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  getProductImage(imageUrl: string | undefined): string {
    if (imageUrl) return imageUrl;
    return 'https://via.placeholder.com/150x150?text=Perfume';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
