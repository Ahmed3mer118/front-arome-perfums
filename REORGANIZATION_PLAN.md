# خطة إعادة تنظيم المشروع

## التغييرات المطلوبة:

### 1. نقل الخدمات:
- ✅ `core/services/dashboard/*` → `dashboard/services/*`
- ⏳ `core/services/auth/*` → `core/services/shared/auth/*`
- ⏳ `core/services/api.service.ts` → `core/services/shared/api.service.ts`
- ⏳ `core/services/user.service.ts` → `core/services/shared/user.service.ts`
- ⏳ `core/services/note.service.ts` → `core/services/shared/note.service.ts`
- ⏳ `core/services/review.service.ts` → `core/services/shared/review.service.ts`
- ⏳ `core/services/dashboard/cart.service.ts` → `frontend/services/cart.service.ts` (مشترك)

### 2. نقل المكونات:
- ⏳ `core/components/*` → `core/components/auth/*`

### 3. نقل الـ Interfaces:
- ⏳ `core/interfaceModel/interface.model.ts` → `core/interfaces/interface.model.ts`

### 4. حذف المكونات القديمة:
- ⏳ `components/dashboard/` - موجود في `dashboard/components/`
- ⏳ `components/login/` - موجود في `core/components/auth/`
- ⏳ `components/register/` - موجود في `core/components/auth/`
- ⏳ `components/landing-page/` - موجود في `frontend/components/`
- ⏳ `components/users/` - موجود في `dashboard/components/users/`

### 5. تحديث الـ Imports في جميع الملفات

