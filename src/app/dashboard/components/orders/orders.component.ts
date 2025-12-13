import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

interface Item {
  perfume?: { 
    perfume_name: string; 
    image_url: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  order_id: number;
  order_number: string;
  total: number;
  status: OrderStatus;
  items: Item[];
  date?: string;
}

interface CustomerOrders {
  user_id: number;
  full_name: string;
  email: string;
  totalAmount: number;
  orders: Order[];
  created_at?: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit, OnDestroy {
  customers: CustomerOrders[] = [];
  filteredOrders: CustomerOrders[] = [];
  paginatedOrders: CustomerOrders[] = [];

  selectedCustomer: CustomerOrders | null = null;
  showOrderDetails = false;

  currentPage = 1;
  pageSize = 8;
  totalPages = 0;

  isLoading = false;
  subscriptions: Subscription[] = [];

  statusOptions: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

  // متغير لمتابعة الطلبات قيد التحديث
  updatingOrderId: number | null = null;

  constructor(private apiService: ApiService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    const sub = this.apiService.getOrders().subscribe({
      next: (res: any) => {
        const orders = res.data || res;
        const map = new Map<number, CustomerOrders>();

        orders.forEach((order: any) => {
          const userId = order.user_id;
          const user = order.user;

          if (!map.has(userId)) {
            map.set(userId, {
              user_id: userId,
              full_name: user?.full_name || 'Unknown',
              email: user?.email || 'No email',
              totalAmount: 0,
              orders: []
            });
          }

          const customer = map.get(userId)!;
          customer.totalAmount += Number(order.total) || 0;
          
          // تحويل الحالة إلى lowercase للتأكد من التوافق
          const orderStatus = (order.status?.toLowerCase() || 'pending') as OrderStatus;
          
          customer.orders.push({
            order_id: order.order_id || order.id || 0,
            order_number: order.order_number || `ORD${Date.now()}`,
            total: Number(order.total) || 0,
            status: orderStatus,
            items: order.items || [],
            date: order.created_at || order.date
          });
        });

        this.customers = Array.from(map.values());
        this.filteredOrders = [...this.customers];

        this.calculatePagination();
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });

    this.subscriptions.push(sub);
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize) || 1;
    this.changePage(1);
  }

  changePage(page: number): void {
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedOrders = this.filteredOrders.slice(start, end);
  }

  viewCustomerOrders(customer: CustomerOrders): void {
    this.selectedCustomer = { ...customer };
    this.showOrderDetails = true;
  }

  closeDetails(): void {
    this.showOrderDetails = false;
    this.selectedCustomer = null;
  }

  // دالة محسنة لتحديث حالة الطلب
  updateOrderStatus(order: Order, status: OrderStatus): void {
    if (order.status === status) return;
    
    console.log('🔄 Starting status update:', {
      orderId: order.order_id,
      orderNumber: order.order_number,
      oldStatus: order.status,
      newStatus: status
    });

    const oldStatus = order.status;
    
    // تحديث محلي أولي (Optimistic Update)
    order.status = status;
    this.updatingOrderId = order.order_id;
    
    // تحديث الواجهة مباشرة
    if (this.selectedCustomer) {
      const orderIndex = this.selectedCustomer.orders.findIndex(o => o.order_id === order.order_id);
      if (orderIndex !== -1) {
        this.selectedCustomer.orders[orderIndex].status = status;
      }
      this.selectedCustomer = { ...this.selectedCustomer };
    }
    
    // إرسال الطلب للخادم الخلفي
    const sub = this.apiService.updateOrderStatus(order.order_id, status)
      .pipe(
        tap((response: any) => {
          console.log('✅ Server response:', response);
          
          // تحقق من استجابة الخادم
          if (response && (response.success || response.data)) {
            const serverStatus = response.data?.status || response.status;
            
            if (serverStatus) {
              const finalStatus = serverStatus.toLowerCase() as OrderStatus;
              order.status = finalStatus;
              
              // تحديث البيانات المحلية مع استجابة الخادم
              if (this.selectedCustomer) {
                const orderIndex = this.selectedCustomer.orders.findIndex(o => o.order_id === order.order_id);
                if (orderIndex !== -1) {
                  this.selectedCustomer.orders[orderIndex].status = finalStatus;
                }
                this.selectedCustomer = { ...this.selectedCustomer };
              }
              
              console.log(`✅ Status updated successfully to: ${finalStatus}`);
            }
          }
          
          this.updatingOrderId = null;
          this.cd.detectChanges();
        }),
        catchError((error: any) => {
          console.error('❌ Error updating status:', error);
          
          // استرجاع الحالة القديمة في حالة فشل الخادم
          order.status = oldStatus;
          
          if (this.selectedCustomer) {
            const orderIndex = this.selectedCustomer.orders.findIndex(o => o.order_id === order.order_id);
            if (orderIndex !== -1) {
              this.selectedCustomer.orders[orderIndex].status = oldStatus;
            }
            this.selectedCustomer = { ...this.selectedCustomer };
          }
          
          this.updatingOrderId = null;
          this.cd.detectChanges();
          
          // يمكنك إضافة رسالة خطأ للمستخدم هنا
          alert(`Failed to update order status: ${error.message || 'Unknown error'}`);
          
          return of(null);
        })
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}