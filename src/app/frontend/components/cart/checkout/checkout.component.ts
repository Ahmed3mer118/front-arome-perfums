import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ICartItem } from '../../../../core/interfaces/interface.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm: FormGroup;
  cartItems: ICartItem[] = [];
  total = 0;
  loading = false;
  isLoggedIn = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      full_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
      paymentMethod: ['card', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.getToken();
    
    // Load cart items
    const cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getCartTotal();
      
      if (this.cartItems.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
    this.subscriptions.push(cartSub);
    
    // Initial load
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getCartTotal();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }

    // Pre-fill form if logged in
    if (this.isLoggedIn) {
      const userName = this.authService.getName();
      if (userName) {
        this.checkoutForm.patchValue({ full_name: userName });
      }
    }
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      alert('Please fill all required fields correctly.');
      return;
    }

    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    this.loading = true;

    const orderData = {
      ...this.checkoutForm.value,
      items: this.cartItems.map(item => ({
        perfume_id: item.perfume_id,
        quantity: item.quantity,
        price: item.price
      })),
      total_amount: this.total
    };

    this.apiService.createOrder(orderData).subscribe({
      next: (response: any) => {
        console.log('Order placed:', response);
        this.cartService.clearCart();
        alert('Order placed successfully!');
        this.router.navigate(['/profile']);
      },
      error: (error: any) => {
        console.error('Error placing order:', error);
        const errorMsg = error?.error?.message || error?.error?.error || 'Failed to place order. Please try again.';
        alert(errorMsg);
        this.loading = false;
      }
    });
  }

  getProductImage(imageUrl: string | undefined): string {
    if (imageUrl) return imageUrl;
    return 'https://via.placeholder.com/100x100?text=Perfume';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
