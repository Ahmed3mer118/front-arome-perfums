# Arome Perfums - Final Project Structure

## ✅ تم التنظيم بنجاح

### البنية النهائية:

```
src/app/
├── core/                          # الأجزاء الأساسية المشتركة
│   ├── components/
│   │   └── auth/                  # مكونات المصادقة (login, register, forget-password, etc.)
│   ├── guards/                    # Route guards (admin-gruds.guard, user.guard)
│   ├── interceptors/              # HTTP interceptors (auth.interceptor)
│   ├── interfaces/                # TypeScript interfaces (interface.model.ts)
│   ├── models/                    # Data models (user.model.ts)
│   └── services/
│       └── shared/                # الخدمات المشتركة
│           ├── api.service.ts     # Base API service
│           ├── user.service.ts    # User management
│           ├── note.service.ts   # Fragrance notes
│           ├── review.service.ts  # Product reviews
│           └── auth/              # Authentication services
│               ├── auth.service.ts
│               ├── forget-pass.service.ts
│               ├── reset-pass.service.ts
│               ├── verify-code.service.ts
│               └── register.service.ts
│
├── dashboard/                     # لوحة تحكم الإدارة
│   ├── components/                # مكونات Dashboard
│   │   ├── main-dashboard/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── users/
│   │   ├── notification/
│   │   └── setting/
│   ├── layout/                    # Layout Dashboard
│   ├── services/                  # خدمات Dashboard
│   │   ├── products.service.ts
│   │   ├── orders.service.ts
│   │   ├── user-services.service.ts
│   │   ├── reports.service.ts
│   │   └── notification.service.ts
│   └── shared/                    # مكونات مشتركة للDashboard
│       ├── nav/
│       └── sidebar/
│
├── frontend/                      # الواجهة الأمامية للعملاء
│   ├── components/               # مكونات Frontend
│   │   ├── cart/
│   │   ├── product-list/
│   │   ├── profile/
│   │   ├── home-component/
│   │   ├── about/
│   │   ├── contact/
│   │   └── testimonials/
│   ├── layout/                    # Layout Frontend
│   │   ├── header/
│   │   └── footer/
│   └── services/                  # خدمات Frontend
│       ├── cart.service.ts
│       ├── profile.service.ts
│       ├── hero-section.service.ts
│       ├── about-section.service.ts
│       ├── contact-section.service.ts
│       └── testimonial-services.service.ts
│
└── app.routes.ts                  # ملف التوجيه الرئيسي
```

## 📝 ملاحظات مهمة:

1. **الخدمات المشتركة**: موجودة في `core/services/shared/`
2. **خدمات Dashboard**: موجودة في `dashboard/services/`
3. **خدمات Frontend**: موجودة في `frontend/services/`
4. **Interfaces**: تم نقلها من `core/interfaceModel/` إلى `core/interfaces/`
5. **مكونات Auth**: موجودة في `core/components/auth/`

## ⚠️ ملفات قد تحتاج حذف (اختياري):

- `components/` - المكونات القديمة (dashboard, login, register, landing-page, users)
- `core/services/dashboard/` - تم نقلها إلى `dashboard/services/`
- `core/services/auth/` - تم نقلها إلى `core/services/shared/auth/`
- `core/interfaceModel/` - تم نقلها إلى `core/interfaces/`

