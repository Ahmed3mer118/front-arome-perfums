import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://back-end-aromeperfums-production.up.railway.app/api'; 

  constructor(private http: HttpClient) { }



  // المنتجات
  getProducts() {
    return this.http.get(`${this.apiUrl}/perfumes`);
  }

  getProduct(id: number) {
    return this.http.get(`${this.apiUrl}/perfumes/${id}`);
  }

  createProduct(product: any) {
    return this.http.post(`${this.apiUrl}/perfumes`, product);
  }

  updateProduct(id: number, product: any) {
    return this.http.put(`${this.apiUrl}/perfumes/${id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/perfumes/${id}`);
  }

  // الطلبات
  getOrders() {
    return this.http.get(`${this.apiUrl}/orders`);
  }

  getOrderDetails(id: number) {
    return this.http.get(`${this.apiUrl}/orders/${id}`);
  }

  getOrderByUserId(id: number) {
    return this.http.get(`${this.apiUrl}/orders/user/${id}`);
  }
  createOrder(order: any) {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }
  updateOrder(id: number, order: any) {
    return this.http.put(`${this.apiUrl}/orders/${id}`, order);
  }
  updateOrderStatus(id: number, status: any) {
    return this.http.put(`${this.apiUrl}/orders/${id}/status`, {status:status});
  }


  // المستخدمين
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }
  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }
  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }
  
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, userData);
  }
  
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  // إحصائيات للداشبورد
  getStats() {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  // Brands
  getBrands() {
    return this.http.get(`${this.apiUrl}/brands`);
  }

  createBrand(brand: any) {
    return this.http.post(`${this.apiUrl}/brands`, brand);
  }

  updateBrand(id: number, brand: any) {
    return this.http.put(`${this.apiUrl}/brands/${id}`, brand);
  }

  deleteBrand(id: number) {
    return this.http.delete(`${this.apiUrl}/brands/${id}`);
  }

  // Categories
  getCategories() {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  createCategory(category: any) {
    return this.http.post(`${this.apiUrl}/categories`, category);
  }

  updateCategory(id: number, category: any) {
    return this.http.put(`${this.apiUrl}/categories/${id}`, category);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }
}