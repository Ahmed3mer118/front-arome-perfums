# Arome Perfums - Project Structure

## Project Organization

```
src/app/
├── core/                          # Core shared functionality
│   ├── components/
│   │   └── auth/                  # Authentication components (login, register, etc.)
│   ├── guards/                    # Route guards
│   ├── interceptors/              # HTTP interceptors
│   ├── interfaces/                # TypeScript interfaces
│   ├── models/                    # Data models
│   └── services/
│       └── shared/                # Shared services (api, auth, user, note, review)
│
├── dashboard/                     # Admin Dashboard
│   ├── components/                # Dashboard components
│   ├── layout/                    # Dashboard layout
│   ├── services/                  # Dashboard-specific services
│   └── shared/                    # Dashboard shared components
│
├── frontend/                      # Customer-facing Frontend
│   ├── components/                # Frontend components
│   ├── layout/                    # Frontend layout
│   └── services/                  # Frontend-specific services
│
└── app.routes.ts                  # Main routing configuration
```

## Services Organization

### Core Services (Shared)
- `api.service.ts` - Base API service
- `auth/` - Authentication services
- `user.service.ts` - User management
- `note.service.ts` - Fragrance notes
- `review.service.ts` - Product reviews
- `toast/` - Toast notifications

### Dashboard Services
- `products.service.ts` - Product management
- `orders.service.ts` - Order management
- `user-services.service.ts` - User management for admin
- `reports.service.ts` - Sales reports
- `notification.service.ts` - Notifications
- `cart.service.ts` - Cart management (shared with frontend)

### Frontend Services
- `products.service.ts` - Product listing
- `cart.service.ts` - Shopping cart
- `order.service.ts` - Order placement
- `profile.service.ts` - User profile

