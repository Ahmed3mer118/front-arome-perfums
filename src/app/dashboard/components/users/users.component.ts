import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: any[] = [];
  filteredUsers: any[] = [];
  
  userForm: FormGroup;
  isEditing = false;
  showForm = false;
  selectedUserId: number | null = null;
  
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  roles = [
    { value: 'customer', label: 'Customer' },
    { value: 'admin', label: 'Admin' }
  ];

  totalAdmins: number = 0;
  Math = Math; // Expose Math to template

  private subscriptions: Subscription[] = [];

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern('^[0-9+\-\s()]*$')],
      role: ['customer', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const usersSub = this.apiService.getUsers().subscribe({
      next: (data: any) => {
        this.users = Array.isArray(data) ? data : (data.data || []);
        this.filteredUsers = [...this.users];
        this.calculateTotalAdmins();
        this.calculatePagination();
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
    this.subscriptions.push(usersSub);
  }
  openForm(): void {

    this.isEditing = false;
    this.selectedUserId = null;
    this.userForm.reset({
      full_name: '',
      email: '',
      phone: '',
      role: 'customer',
      password: ''
    });
    // إعادة التحقق من كلمة المرور - مطلوبة عند إضافة مستخدم جديد
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showForm = true;
    
    // التمرير للنموذج
    setTimeout(() => {
      document.querySelector('#user-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  calculateTotalAdmins(): void {
    this.totalAdmins = this.users.filter(user => user.role === 'admin').length;
  }

  onSubmit(): void {
    // التحقق من password عند إضافة مستخدم جديد
    if (!this.isEditing) {
      const passwordControl = this.userForm.get('password');
      if (!passwordControl?.value || passwordControl.value.trim() === '') {
        passwordControl?.markAsTouched();
        alert('Password is required for new users');
        return;
      }
    }

    if (this.userForm.valid) {
      const formData = { ...this.userForm.value };
      
      // إذا كان تعديل ولا نريد تغيير كلمة المرور، نحذفها من البيانات
      if (this.isEditing && !formData.password) {
        delete formData.password;
      }
      
      if (this.isEditing && this.selectedUserId) {
        const updateSub = this.apiService.updateUser(this.selectedUserId, formData).subscribe({
          next: (response: any) => {
            console.log('User updated:', response);
            this.loadUsers();
            this.resetForm();
            alert('User updated successfully!');
          },
          error: (error: any) => {
            console.error('Error updating user:', error);
            const errorMsg = error?.error?.message || error?.error?.error || 'Error updating user. Please try again.';
            alert(errorMsg);
          }
        });
        this.subscriptions.push(updateSub);
      } else {
        // التأكد من وجود كلمة المرور للإنشاء
        if (!formData.password || formData.password.trim() === '') {
          this.userForm.get('password')?.markAsTouched();
          alert('Password is required for new users');
          return;
        }
        
        const createSub = this.apiService.createUser(formData).subscribe({
          next: (response: any) => {
            console.log('User created:', response);
            this.loadUsers();
            this.resetForm();
            alert('User created successfully!');
          },
          error: (error: any) => {
            console.error('Error creating user:', error);
            const errorMsg = error?.error?.message || error?.error?.error || 'Error creating user. Please try again.';
            alert(errorMsg);
          }
        });
        this.subscriptions.push(createSub);
      }
    } else {
      this.markFormGroupTouched(this.userForm);
      alert('Please fill all required fields correctly.');
    }
  }

  editUser(user: any): void {
    this.isEditing = true;
    this.selectedUserId = user.user_id;
    this.showForm = true;
    
    this.userForm.patchValue({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
    
    // إزالة التحقق من كلمة المرور في التعديل
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    
    // التمرير للنموذج
    setTimeout(() => {
      document.querySelector('#user-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  viewUserOrders(user: any): void {
    // Navigate to orders page with user filter
    this.router.navigate(['/dashboard/orders'], { 
      queryParams: { userId: user.user_id, userName: user.full_name } 
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const deleteSub = this.apiService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
          alert('User deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Error deleting user. Please try again.');
        }
      });
      this.subscriptions.push(deleteSub);
    }
  }

  resetForm(): void {
    this.userForm.reset({
      full_name: '',
      email: '',
      phone: '',
      role: 'customer',
      password: ''
    });
    
    // إعادة التحقق من كلمة المرور - مطلوبة عند إضافة مستخدم جديد
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    
    this.isEditing = false;
    this.selectedUserId = null;
    this.showForm = false;
  }

  searchUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.full_name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  get paginatedUsers(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getRoleBadgeClass(role: string): string {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  }

  getRoleDisplayName(role: string): string {
    return role === 'admin' ? 'Admin' : 'Customer';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // دالة لنسخ كلمة المرور الافتراضية
  generatePassword(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.userForm.patchValue({ password });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}