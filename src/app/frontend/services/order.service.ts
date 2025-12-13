import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createOrderFromCart(cartItems: any[], shippingAddress?: string): Observable<any> {
 
 


    const orderItems = cartItems.map(item => ({
      perfume_id: item.perfume_id,
      quantity: item.quantity

    }));

    const orderData = {
      user_id: "", // الحصول من AuthService
      items: orderItems,
      shipping_address: shippingAddress || '',
      status: 'pending'
    };

    return this.http.post(`${this.apiUrl}/orders`, orderData);
  }

  // الحصول على جميع الطلبات
  getOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`);
  }

  // الحصول على طلب محدد
  getOrderById(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${orderId}`);
  }

  // تحديث حالة الطلب
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/status`, { status });
  }

  // حذف طلب
  cancelOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${orderId}`);
  }
}