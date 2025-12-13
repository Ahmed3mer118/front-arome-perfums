import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { IProducts, ICartItem } from '../../core/interfaces/interface.model';
import { AuthService } from '../../core/services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl;
  private cartItemsSubject = new BehaviorSubject<ICartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();
  private orderNumber: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadCart();
  }

  getOrderNumber(): string | null {
    return this.orderNumber;
  }
  private loadCart(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;
  
    this.http.get<any>(`${this.apiUrl}/orders/user/${userId}`).subscribe({
      next: (res) => {
        const pendingOrders = res.data?.filter((o: any) => o.status === 'pending') || [];
  
        // دمج كل الـ items في array واحد
        const allItems = pendingOrders.flatMap((o: any) =>
          o.items.map((item: any) => ({ ...item, order_number: o.order_number }))
        );
          
        // إذا عايز orderNumber من أول order فقط
        this.orderNumber = pendingOrders[0]?.order_number || null;
  
        this.cartItemsSubject.next([...allItems]); // 👈 reference جديدة
        this.updateCartCount();
      },
      error: () => {
        this.cartItemsSubject.next([]);
        this.cartCountSubject.next(0);
      }
    });
  }
  
  

  addToCart(product: IProducts, quantity: number = 1): Observable<any> {
    const token = this.authService.getToken();
    const userId = this.authService.getUserId();
  
    if (!token || !userId) {
      return new Observable(observer => {
        observer.error('User not authenticated');
        observer.complete();
      });
    }
  
    return this.http.post(`${this.apiUrl}/orders`, {
      user_id: userId,
      items: [
        {
          perfume_id: product.perfume_id,
          quantity
        }
      ]
    }).pipe(
      tap(() => this.loadCart())
    );
  }
  

  updateQuantity(item: ICartItem, quantity: number): Observable<any> {
    const token = this.authService.getToken();
    const orderNumber = item.order_number; 
    if (!token || !orderNumber) {
      return new Observable(observer => {
        observer.error('No active order');
        observer.complete();
      });
    }
    return this.http
      .put(`${this.apiUrl}/orders/${orderNumber}/items/${item.perfume_id}`, { quantity })
      .pipe(tap(() => this.loadCart()));
  }
  
  removeFromCart(item: ICartItem): Observable<any> {
    const token = this.authService.getToken();
    const orderNumber = item.order_number;
    
    if (!token || !orderNumber) {
      return new Observable(observer => {
        observer.error('No active order');
        observer.complete();
      });
    }
  
    return this.http
      .delete(`${this.apiUrl}/orders/${orderNumber}/items/${item.perfume_id}`)
      .pipe(tap(() => this.loadCart()));
  }
  
  
  
  clearCart(): void {
    const token = this.authService.getToken();
    
    if (token) {
      this.http.delete(`${this.apiUrl}/orders`).subscribe(() => {
        this.cartItemsSubject.next([]);
        this.updateCartCount();
      });
    } else {
      localStorage.removeItem('guest_cart');
      this.cartItemsSubject.next([]);
      this.updateCartCount();
    }
  }

  getCartItems(): ICartItem[] {
    return this.cartItemsSubject.value;
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getCartCount(): number {
    return this.cartItemsSubject.value.reduce((count, item) => count + item.quantity, 0);
  }

  private updateCartCount(): void {
    const count = this.getCartCount();
    this.cartCountSubject.next(count);
  }

  transferGuestCartToUser(): void {
    const guestCart = localStorage.getItem('guest_cart');
    if (guestCart) {
      try {
        const items = JSON.parse(guestCart);
        items.forEach((item: any) => {
          this.http.post(`${this.apiUrl}/orders`, {
            perfume_id: item.perfume_id,
            quantity: item.quantity,
            price: item.price
          }).subscribe();
        });
        localStorage.removeItem('guest_cart');
        this.loadCart();
      } catch (e) {
        console.error('Error transferring cart:', e);
      }
    }
  }
}

