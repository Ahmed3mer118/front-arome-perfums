import { Routes } from '@angular/router';
import { adminGrudsGuard } from './core/guards/admin-gruds.guard';
import { userGuard } from './core/guards/user.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/layout/layout/layout.component').then(
        (c) => c.LayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./core/components/login/login.component').then(
            (c) => c.LoginComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./core/components/register/register.component').then(
            (c) => c.RegisterComponent
          ),
      },
      {
        path: 'verify-code',
        loadComponent: () =>
          import('./core/components/verify-code/verify-code.component').then(
            (c) => c.VerifyCodeComponent
          ),
      },
      {
        path: 'forget-password',
        loadComponent: () =>
          import('./core/components/forget-password/forget-password.component').then(
            (c) => c.ForgetPasswordComponent
          ),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./core/components/reset-password/reset-password.component').then(
            (c) => c.ResetPasswordComponent
          ),
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/layout/layout/layout.component').then(
        (c) => c.LayoutComponent
      ),
    // canActivate: [adminGrudsGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './dashboard/components/main-dashboard/main-dashboard.component'
          ).then((c) => c.MainDashboardComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./dashboard/components/orders/orders.component').then(
            (c) => c.OrdersComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./dashboard/components/products/products.component').then(
            (c) => c.ProductsComponent
          ),
      },
      {
        path: 'products/add-product',
        loadComponent: () =>
          import(
            './dashboard/components/products/product-form/product-form.component'
          ).then((c) => c.ProductFormComponent),
      },
      {
        path: 'products/edit/:routeProduct',
        loadComponent: () =>
          import(
            './dashboard/components/products/product-form/product-form.component'
          ).then((c) => c.ProductFormComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./dashboard/components/users/users.component').then(
            (c) => c.UsersComponent
          ),
      },
      {
        path: 'notification',
        loadComponent: () =>
          import('./dashboard/components/notification/notification.component').then(
            (c) => c.NotificationComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./dashboard/components/setting/setting.component').then(
            (c) => c.SettingComponent
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./frontend/layout/layout.component').then(
        (c) => c.LayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './frontend/components/main-component/main-component.component'
          ).then((c) => c.MainComponentComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import(
            './frontend/components/product-list/product-list.component'
          ).then((c) => c.ProductListComponent),
      },
      {
        path: 'products/product/:routeProduct',
        loadComponent: () =>
          import(
            './frontend/components/product-list/product-details/product-details.component'
          ).then((c) => c.ProductDetailsComponent),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./frontend/components/cart/cart.component').then(
            (c) => c.CartComponent
          ),
      },
      {
        path: 'checkout',
        canActivate: [userGuard],
        loadComponent: () =>
          import(
            './frontend/components/cart/checkout/checkout.component'
          ).then((c) => c.CheckoutComponent),
      },
      {
        path: 'profile',
        canActivate: [userGuard],
        loadComponent: () =>
          import('./frontend/components/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
      {
        path: 'orders/:id',
        canActivate: [userGuard],
        loadComponent: () =>
          import(
            './frontend/components/profile/order/details/details.component'
          ).then((c) => c.DetailsComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./frontend/components/about/about.component').then(
            (c) => c.AboutComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./frontend/components/contact/contact.component').then(
            (c) => c.ContactComponent
          ),
      },
    ],
  },
];

