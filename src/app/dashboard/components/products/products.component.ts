import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import {  ReactiveFormsModule   , FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  brands: any[] = [];
  categories: any[] = [];
  productForm: FormGroup;
  brandForm: FormGroup;
  categoryForm: FormGroup;
  isEditing = false;
  currentProductId: number | null = null;
  showForm = false;
  showBrandForm = false;
  showCategoryForm = false;
  isEditingBrand = false;
  isEditingCategory = false;
  currentBrandId: number | null = null;
  currentCategoryId: number | null = null;
  activeTab: 'products' | 'brands' | 'categories' = 'products';

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      perfume_name: ['', Validators.required],
      brand_id: ['', Validators.required],
      category_id: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      size_ml: ['', [Validators.required, Validators.min(1)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      image_url: ['']
    });

    this.brandForm = this.fb.group({
      brand_name: ['', Validators.required]
    });

    this.categoryForm = this.fb.group({
      category_name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadBrands();
    this.loadCategories();
  }

  loadProducts() {
    this.apiService.getProducts().subscribe((data: any) => {
      this.products = data.data.rows;
    // console.log(data.data);
    }, (error: any) => {
      console.error('Error loading products', error);
    });
  }

  loadBrands() {
    this.apiService.getBrands().subscribe(
      (data: any) => {
        this.brands = Array.isArray(data) ? data : (data.data || []);
      },
      (error: any) => {
        console.error('Error loading brands', error);
      }
    );
  }

  loadCategories() {
    this.apiService.getCategories().subscribe(
      (data: any) => {
        this.categories = Array.isArray(data) ? data : (data.data || []);
      },
      (error: any) => {
        console.error('Error loading categories', error);
      }
    );
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (this.isEditing && this.currentProductId) {
        this.apiService.updateProduct(this.currentProductId, this.productForm.value).subscribe(
          () => {
            this.loadProducts();
            this.resetForm();
          },
          error => {
            console.error('Error updating product', error);
          }
        );
      } else {
        this.apiService.createProduct(this.productForm.value).subscribe(
          () => {
            this.loadProducts();
            this.resetForm();
          },
          error => {
            console.error('Error creating product', error);
          }
        );
      }
    }
  }

  editProduct(product: any) {
    this.isEditing = true;
    this.currentProductId = product.perfume_id;
    this.productForm.patchValue(product);
    this.showForm = true;
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiService.deleteProduct(id).subscribe(
        () => {
          this.loadProducts();
        },
        error => {
          console.error('Error deleting product', error);
        }
      );
    }
  }

  resetForm() {
    this.productForm.reset();
    this.isEditing = false;
    this.currentProductId = null;
    this.showForm = false;
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  // Brand Management
  onSubmitBrand() {
    if (this.brandForm.valid) {
      if (this.isEditingBrand && this.currentBrandId) {
        this.apiService.updateBrand(this.currentBrandId, this.brandForm.value).subscribe(
          () => {
            this.loadBrands();
            this.resetBrandForm();
          },
          error => {
            console.error('Error updating brand', error);
          }
        );
      } else {
        this.apiService.createBrand(this.brandForm.value).subscribe(
          () => {
            this.loadBrands();
            this.resetBrandForm();
          },
          error => {
            console.error('Error creating brand', error);
          }
        );
      }
    }
  }

  editBrand(brand: any) {
    this.isEditingBrand = true;
    this.currentBrandId = brand.brand_id;
    this.brandForm.patchValue(brand);
    this.showBrandForm = true;
  }

  deleteBrand(id: number) {
    if (confirm('Are you sure you want to delete this brand?')) {
      this.apiService.deleteBrand(id).subscribe(
        () => {
          this.loadBrands();
        },
        error => {
          console.error('Error deleting brand', error);
        }
      );
    }
  }

  resetBrandForm() {
    this.brandForm.reset();
    this.isEditingBrand = false;
    this.currentBrandId = null;
    this.showBrandForm = false;
  }

  toggleBrandForm() {
    this.showBrandForm = !this.showBrandForm;
    if (!this.showBrandForm) {
      this.resetBrandForm();
    }
  }

  // Category Management
  onSubmitCategory() {
    if (this.categoryForm.valid) {
      if (this.isEditingCategory && this.currentCategoryId) {
        this.apiService.updateCategory(this.currentCategoryId, this.categoryForm.value).subscribe(
          () => {
            this.loadCategories();
            this.resetCategoryForm();
          },
          error => {
            console.error('Error updating category', error);
          }
        );
      } else {
        this.apiService.createCategory(this.categoryForm.value).subscribe(
          () => {
            this.loadCategories();
            this.resetCategoryForm();
          },
          error => {
            console.error('Error creating category', error);
          }
        );
      }
    }
  }

  editCategory(category: any) {
    this.isEditingCategory = true;
    this.currentCategoryId = category.category_id;
    this.categoryForm.patchValue(category);
    this.showCategoryForm = true;
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.apiService.deleteCategory(id).subscribe(
        () => {
          this.loadCategories();
        },
        error => {
          console.error('Error deleting category', error);
        }
      );
    }
  }

  resetCategoryForm() {
    this.categoryForm.reset();
    this.isEditingCategory = false;
    this.currentCategoryId = null;
    this.showCategoryForm = false;
  }

  toggleCategoryForm() {
    this.showCategoryForm = !this.showCategoryForm;
    if (!this.showCategoryForm) {
      this.resetCategoryForm();
    }
  }
}