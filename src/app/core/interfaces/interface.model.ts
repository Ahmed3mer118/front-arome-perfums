// Auth Interfaces
export interface IRegister {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'customer' | 'admin';
}

export interface ILogin {
  email?: string;
  phone?: string;
  password: string;
}

export interface ILoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      user_id: number;
      full_name: string;
      email: string;
      phone?: string;
      role: 'customer' | 'admin';
    };
  };
}
export interface setUser{
  user_id: number;
  full_name: string;
  email: string;
  role: string;
}



export interface ITokenData {
  user_id: number;
  role: string;
  full_name: string;
  email: string;
}

export interface IResetPassword {
  email: string;
  resetCode: string;
  newPassword: string;
}

// Product Interfaces
export interface IProducts {
  perfume_id?: number;
  perfume_name: string;
  image_url: string;
  price: number;
  description?: string;
  category_name?: string;
  stock: number;
  routeProduct?: string;
  minStock?: number;
  isActive?: boolean;
  brand?: IBrand;
  brand_id?:IBrand | null;
  category?: ICategory;
  category_id?:ICategory | null;
  product_title?: string;
  product_image?: string;
  product_description?: string;
}

export interface IBrand {
  brand_id?: number;
  brand_name: string;
}

export interface ICategory {
  category_id?: number;
  category_name: string;
}

export interface INote {
  note_id?: number;
  perfume_id: number;
  note_type: 'Top' | 'Heart' | 'Base';
  note_name: string;
}

export interface IReview {
  review_id?: number;
  user_id: number;
  perfume_id: number;
  rating: number;
  comment?: string;
  review_date?: string;
  User?: {
    user_id: number;
    full_name: string;
  };
}

// Cart Interfaces
export interface ICart {
  perfume_id: number;
  quantity: number;
}

export interface ICartItem {
  cart_id?: number;
  perfume_id: number;
  perfume?: IProducts;
  user_id: number;
  quantity: number;
  price: number;
  order_number?:string
}

// Order Interfaces
export interface IOrders {
  order_id?: number;
  order_number?: string;
  user_id: number;
  userId?: {
    user_id: number;
    full_name: string;
    email: string;
  };
  items: IOrderItem[];
  status: string;
  total_amount?: number;
  created_at?: string;
  shipping_address?: string;
  shipping_phone?: string;
  payment_method?: string;
}

export interface IOrderItem {
  item_id?: number;
  order_id?: number;
  perfume_id: number;
  quantity: number;
  price: number;
  product_title?: string;
  product_image?: string;
}

// User Interfaces
export interface IUser {
  user_id?: number;
  full_name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  created_at?: string;
}

export interface IProfile {
  user_id: number;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
}

// Testimonial Interface
export interface Testimonial {
  testimonial_id?: number;
  name: string;
  comment: string;
  rating: number;
  isActive?: boolean;
  user_id?: number;
}

// Dashboard Interfaces
export interface SidebarItem {
  icon: string;
  label: string;
  href: string;
  active: boolean;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Product {
  id: number;
  name: string;
  quantitySold: number;
  price: number;
  revenue: number;
}

