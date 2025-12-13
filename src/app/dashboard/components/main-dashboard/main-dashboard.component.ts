import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {
  stats = {
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0
  };

  isLoading = true;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;

    this.apiService.getProducts().subscribe({
      next: (res: any) => {
        this.stats.totalProducts = res.data.count || 0;
      },
      error: () => this.stats.totalProducts = 0
    });

    // جلب عدد الطلبات
    this.apiService.getOrders().subscribe({
      next: (res: any) => {
        const orders = res.data || [];
        this.stats.totalOrders = orders.length;
        this.stats.revenue = orders.reduce((acc: number, order: any) => acc + Number(order.total), 0);
      },
      error: () => {
        this.stats.totalOrders = 0;
        this.stats.revenue = 0;
      }
    });

    // جلب عدد المستخدمين
    this.apiService.getUsers().subscribe({
      next: (res: any) => {
        this.stats.totalUsers = res.data.length || 0;
      },
      error: () => this.stats.totalUsers = 0
    });

    this.isLoading = false;
  }
}
