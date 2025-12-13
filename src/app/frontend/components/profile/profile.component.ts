import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

interface Order {
  order_id: number;
  order_number: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

interface User {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
  orders: Order[];
}
interface Item {
  perfume?: { perfume_name: string, image_url: string };
  quantity: number;
  price: number;
}

interface Order {
  order_number: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items?: Item[]; 
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  userId!: number;
  userData!: User;
  isLoading = false;
  ordersLoading = false;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id')) || 11;
    this.loadUser();
  }

  loadUser(): void {
    this.isLoading = true;
    this.apiService.getUser(this.userId).subscribe({
      next: (res: any) => {
        this.userData = res.data || res;
        this.isLoading = false;
        this.loadUserOrders(); // بعد جلب بيانات اليوزر، جلب الأوردرات
      },
      error: () => this.isLoading = false
    });
  }

  loadUserOrders(): void {
    if (!this.userId) return;
    this.ordersLoading = true;

    this.apiService.getOrderByUserId(this.userId).subscribe({
      next: (res: any) => {
        this.userData.orders = res.data || [];
        this.ordersLoading = false;
      },
      error: () => this.ordersLoading = false
    });
  }
}
