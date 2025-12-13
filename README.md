# Arome Perfums - Frontend

Frontend application for Arome Perfums E-commerce Store built with Angular.

## Description

This is the frontend application for the Arome Perfums e-commerce store. It provides a modern, responsive user interface for browsing perfumes, managing cart, placing orders, and user authentication.

## Features

- **Product Catalog**: Browse perfumes by brand, category, and search
- **Product Details**: View detailed information about each perfume including notes and reviews
- **Shopping Cart**: Add products to cart and manage quantities
- **Checkout**: Secure checkout process for placing orders
- **User Authentication**: Register, login, and manage user profile
- **Order Management**: View order history and order details
- **Admin Dashboard**: Manage products, orders, and users (for admins)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Project Structure

```
src/
├── app/
│   ├── components/          # Feature components
│   ├── core/                 # Core services, guards, interceptors
│   ├── dashboard/           # Admin dashboard components
│   ├── frontend/            # Customer-facing components
│   ├── models/              # Data models/interfaces
│   └── app.routes.ts        # Application routes
├── environments/            # Environment configuration
└── styles.css               # Global styles
```

## API Configuration

Update the API URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## Technologies Used

- Angular 19
- TypeScript
- Tailwind CSS
- RxJS
- Angular Router
- Angular Forms

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Overview](https://angular.dev/tools/cli)
