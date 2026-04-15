# E-Commerce Admin Panel & Excel Import

Bu loyiha mahsulotlarni boshqarish va Excel orqali ommaviy import qilish imkoniyatini beruvchi to'liq admin panel va backend tizimidir.

## Talablar

- Node.js 18+
- PostgreSQL (Neon.tech ishlatilgan)

## O'rnatish va Ishga Tushirish

1. **Kutubxonalarni o'rnatish**:
   ```bash
   npm install
   ```

2. **Ma'lumotlar bazasini sozlash**:
   `.env` faylida `DATABASE_URL` to'g'ri sozlanganligiga ishonch hosil qiling. Keyin:
   ```bash
   npx prisma db push
   ```

3. **Loyihani ishga tushirish**:
   ```bash
   npm run dev
   ```

4. **Admin panelga kirish**:
   Brauzerda `http://localhost:3000/admin/products` manziliga kiring.

## Excel Import Qoidalari

Excel fayli quyidagi ustunlarga ega bo'lishi kerak:
- `title_uz`: Mahsulot nomi
- `price`: Narxi (son)
- `available`: Mavjudligi (1 yoki 0)
- `weight`: Vazni (matn)
- `category_name`: Kategoriya nomi

*Namuna faylni admin panelning o'zidan ("Template" tugmasi orqali) yuklab olishingiz mumkin.*

## Xususiyatlari

- **Premium UI**: Modern dark mode dizayn.
- **Auto-Category**: Exceldan import qilayotganda koti mezon mavjud bo'lmasa, u avtomatik yaratiladi.
- **Bulk Import**: Yuzlab mahsulotlarni bir necha soniyada yuklash imkoniyati.
- **Real-time Stats**: Mahsulotlar soni va holati bo'yicha statistik ma'lumotlar.
