'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPrice, calcInstallment, calcCreditPrice } from '@/lib/utils';
import { Product, Category, Brand } from '@/lib/types';
import { Plus, Pencil, Trash2, Upload, ImageIcon, X, Search, ShoppingCart, Heart, Star, Check, AlertCircle, Tag, FileSpreadsheet, Download, Info } from 'lucide-react';

// ─── Mock Orders with delete support ───
const INITIAL_ORDERS = [
    { id: '#1001', customer: 'Dilya', phone: '+998901234567', product: 'iPhone 15 Pro Max', amount: 17990000, status: 'new', date: '2026-03-22, 21:07:54', address: 'Andijon, Toshkent', installment: 12 },
    { id: '#1002', customer: 'Jasur M.', phone: '+998901112233', product: 'MacBook Pro M3', amount: 24990000, status: 'processing', date: '2026-03-23, 18:33:53', address: "Ko'rsatilmagan", installment: 24 },
    { id: '#1003', customer: 'Sobirov Dilyor', phone: '+998775062020', product: 'Sony WH-1000XM5', amount: 3990000, status: 'new', date: '2026-03-23, 01:32:34', address: "Ko'rsatilmagan", installment: 6 },
    { id: '#1004', customer: 'Kamola T.', phone: '+998901234000', product: 'Samsung S24 Ultra', amount: 14990000, status: 'delivered', date: '2026-03-24, 10:00:00', address: 'Toshkent shahar', installment: 18 },
];

// INSTALLMENT_OPTIONS are now dynamic from the database via useStore().installmentPlans

interface NewProduct {
    name: string; nameRu: string; brand: string; price: string; oldPrice: string;
    category: string; imageUrl: string; imageFile: File | null; imagePreview: string;
    inStock: boolean; isNew: boolean; isFeatured: boolean;
    installmentMonths: number; discountPercent: string;
    creditMarkupPercent: string;
    specs: { key: string; value: string }[];
    extraImages: string[];
    variants: { color: string; colorName: string; colorNameRu: string; image: string }[];
}

interface NewCategory {
    slug: string; name: string; nameRu: string; icon: string; color: string;
    imageUrl: string; imageFile: File | null; imagePreview: string;
}

const emptyProduct: NewProduct = {
    name: '', nameRu: '', brand: '', price: '', oldPrice: '',
    category: 'smartphones', imageUrl: '', imageFile: null, imagePreview: '',
    inStock: true, isNew: false, isFeatured: false,
    installmentMonths: 12, discountPercent: '', creditMarkupPercent: '',
    specs: [],
    extraImages: [],
    variants: [],
};

const emptyCategory: NewCategory = {
    slug: '', name: '', nameRu: '', icon: '📁', color: '#ffffff',
    imageUrl: '', imageFile: null, imagePreview: '',
};

const TABS = [
    { id: 'dashboard', label: 'Bosh sahifa' },
    { id: 'products', label: 'Mahsulotlar' },
    { id: 'orders', label: 'Buyurtmalar' },
    { id: 'installments', label: "Bo'lib to'lash" },
    { id: 'categories', label: 'Kategoriyalar' },
    { id: 'brands', label: 'Brendlar' },
    { id: 'excel-import', label: '📥 Excel Import' },
    { id: 'users', label: 'Foydalanuvchilar' },
];

import { useStore } from '@/lib/store';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('dashboard');
    const { products, setProducts, orders, setOrders, categories, setCategories, brands, setBrands, visitors, installmentPlans, fetchAll, fetchOrders, fetchVisitors, fetchProducts, fetchCategories, fetchBrands, fetchInstallmentPlans } = useStore();
    const [newBrandName, setNewBrandName] = useState('');
    // Installment plan states
    const [newPlanMonths, setNewPlanMonths] = useState('');
    const [newPlanPercent, setNewPlanPercent] = useState('');
    const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [newProduct, setNewProduct] = useState<NewProduct>(emptyProduct);
    const [newCategory, setNewCategory] = useState<NewCategory>(emptyCategory);
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
    const [catImageMode, setCatImageMode] = useState<'url' | 'upload'>('url');
    const [searchQ, setSearchQ] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [toast, setToast] = useState('');
    // Excel import states
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [excelImporting, setExcelImporting] = useState(false);
    const [excelResult, setExcelResult] = useState<any>(null);
    const [excelDragOver, setExcelDragOver] = useState(false);
    const excelInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isGeneratingSpecs, setIsGeneratingSpecs] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('admin_auth') !== 'true') {
            router.replace('/login');
        }
        // API dan ma'lumotlarni yuklash
        fetchAll();
        fetchOrders();
        fetchVisitors();
        fetchInstallmentPlans();
    }, [router]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const logout = () => { localStorage.removeItem('admin_auth'); router.push('/login'); };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewProduct(p => ({ ...p, imageFile: file, imagePreview: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleCategoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewCategory(c => ({ ...c, imageFile: file, imagePreview: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleAddCategory = async () => {
        if (!newCategory.slug || !newCategory.name || !newCategory.nameRu) {
            showToast('❌ Kategoriya slug, nomi va ruscha nomi kiritilishi shart!');
            return;
        }

        const image = catImageMode === 'upload'
            ? newCategory.imagePreview || 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=200&q=80'
            : newCategory.imageUrl || 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=200&q=80';

        try {
            if (editCategory) {
                await fetch('/api/categories', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: editCategory.id,
                        slug: newCategory.slug.trim(),
                        name: newCategory.name.trim(),
                        nameRu: newCategory.nameRu.trim(),
                        icon: newCategory.icon || '📁',
                        color: newCategory.color || '#ffffff',
                        image,
                    }),
                });
                showToast('✅ Kategoriya yangilandi!');
            } else {
                const res = await fetch('/api/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        slug: newCategory.slug.trim(),
                        name: newCategory.name.trim(),
                        nameRu: newCategory.nameRu.trim(),
                        icon: newCategory.icon || '📁',
                        color: newCategory.color || '#ffffff',
                        image,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Server xatosi');
                showToast('✅ Kategoriya qo\'shildi!');
            }
            await fetchCategories();
        } catch (err: any) { 
            console.error('Categoriyani saqlashda xato:', err);
            showToast(`❌ Xatolik: ${err.message}`); 
        }

        setNewCategory(emptyCategory);
        setEditCategory(null);
        setShowAddCategoryForm(false);
    };

    const handleEditCategory = (c: Category) => {
        setEditCategory(c);
        setNewCategory({
            slug: c.slug, name: c.name, nameRu: c.nameRu || '',
            icon: c.icon || '', color: c.color || '#ffffff',
            imageUrl: c.image || '', imageFile: null, imagePreview: '',
        });
        setCatImageMode('url');
        setShowAddCategoryForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteCategory = async (id: number) => {
        try {
            await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
            await fetchCategories();
            showToast('🗑️ Kategoriya o‘chirildi!');
        } catch { showToast('❌ Xatolik!'); }
    };

    const handleGenerateSpecs = async () => {
        if (!newProduct.name) {
            showToast('❌ Avval mahsulot nomini kiriting!');
            return;
        }
        setIsGeneratingSpecs(true);
        try {
            const res = await fetch('/api/generate-specs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName: newProduct.name }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Server xatosi');
            if (data.specs && Array.isArray(data.specs)) {
                setNewProduct(p => ({ ...p, specs: data.specs }));
                showToast("✅ Xususiyatlar yuklandi!");
            }
        } catch (err: any) {
            showToast(`❌ Xatolik: ${err.message}`);
        } finally {
            setIsGeneratingSpecs(false);
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.price) {
            showToast('❌ Nomi va narxi kiritilishi shart!'); return;
        }
        const img = imageMode === 'upload'
            ? newProduct.imagePreview || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'
            : newProduct.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80';
        const priceNum = parseInt(newProduct.price.replace(/\D/g, ''));
        const oldPriceNum = newProduct.oldPrice ? parseInt(newProduct.oldPrice.replace(/\D/g, '')) : undefined;
        const discNum = newProduct.discountPercent ? parseInt(newProduct.discountPercent) : undefined;

        const specsObj: Record<string, string> = {};
        newProduct.specs.forEach(s => {
            if (s.key.trim() && s.value.trim()) specsObj[s.key.trim()] = s.value.trim();
        });
        const specs = Object.keys(specsObj).length > 0 ? specsObj : undefined;
        const creditMarkup = newProduct.creditMarkupPercent ? parseInt(newProduct.creditMarkupPercent) : undefined;
        const validExtraImages = newProduct.extraImages.filter(u => u.trim());
        const validVariants = newProduct.variants.filter(v => v.colorName.trim());

        try {
            if (editProduct) {
                const res = await fetch('/api/products', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: editProduct.id, name: newProduct.name, nameRu: newProduct.nameRu || newProduct.name,
                        brand: newProduct.brand, price: priceNum, oldPrice: oldPriceNum,
                        category: newProduct.category, image: img, inStock: newProduct.inStock,
                        isNew: newProduct.isNew, isFeatured: newProduct.isFeatured,
                        installmentMonths: newProduct.installmentMonths, discountPercent: discNum,
                        creditMarkupPercent: creditMarkup, specs,
                        extraImages: validExtraImages,
                        variants: validVariants,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Tarmoq xatosi yoki baza topilmadi");
                showToast('✅ Mahsulot yangilandi!');
            } else {
                const res = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: newProduct.name, nameRu: newProduct.nameRu || newProduct.name,
                        brand: newProduct.brand || 'Boshqa', category: newProduct.category,
                        price: priceNum, oldPrice: oldPriceNum, image: img,
                        inStock: newProduct.inStock, isNew: newProduct.isNew,
                        isFeatured: newProduct.isFeatured, installmentMonths: newProduct.installmentMonths,
                        discountPercent: discNum, creditMarkupPercent: creditMarkup, specs,
                        extraImages: validExtraImages,
                        variants: validVariants,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Tarmoq xatosi yoki baza topilmadi");
                showToast('✅ Mahsulot qo\'shildi!');
            }
            await fetchProducts();
        } catch (err: any) { showToast(`❌ Xatolik: ${err.message || 'Noma\'lum xato'}`); }
        setNewProduct(emptyProduct); setShowAddForm(false); setEditProduct(null);
    };


    const handleEdit = async (p: Product) => {
        setEditProduct(p);
        const specsArray = p.specs ? Object.entries(p.specs).map(([key, value]) => ({ key, value: value as string })) : [];

        // Mavjud rasmlar va variantlarni API dan yuklaymiz
        let extraImages: string[] = [];
        let variants: { color: string; colorName: string; colorNameRu: string; image: string }[] = [];
        try {
            const res = await fetch(`/api/products/${p.id}`);
            const data = await res.json();
            if (data.product) {
                // Asosiy rasmdan tashqari qo'shimcha rasmlar
                extraImages = (data.product.images || []).filter((img: string) => img !== p.image);
                variants = (data.product.variants || []).map((v: any) => ({
                    color: v.color || '#000000',
                    colorName: v.colorName || '',
                    colorNameRu: v.colorNameRu || '',
                    image: v.image || '',
                }));
            }
        } catch (e) {
            console.error('Variant/rasmlarni yuklashda xato:', e);
        }

        setNewProduct({
            name: p.name, nameRu: p.nameRu || p.name, brand: p.brand, price: String(p.price),
            oldPrice: p.oldPrice ? String(p.oldPrice) : '', category: p.category,
            imageUrl: p.image, imageFile: null, imagePreview: '',
            inStock: p.inStock, isNew: !!p.isNew, isFeatured: !!p.isFeatured,
            installmentMonths: p.installmentMonths || 12, discountPercent: p.discountPercent ? String(p.discountPercent) : '',
            creditMarkupPercent: p.creditMarkupPercent ? String(p.creditMarkupPercent) : '',
            specs: specsArray,
            extraImages,
            variants,
        });
        setImageMode('url');
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    // Brand management
    const handleAddBrand = async () => {
        if (!newBrandName.trim()) { showToast('❌ Brend nomini kiriting!'); return; }
        try {
            const res = await fetch('/api/brands', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newBrandName.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Server xatosi');
            
            await fetchBrands();
            setNewBrandName('');
            showToast('✅ Brend qo\'shildi!');
        } catch (err: any) { 
            console.error('Brendni saqlashda xato:', err);
            showToast(`❌ Xatolik: ${err.message || 'Server xatosi'}`); 
        }
    };

    const handleDeleteBrand = async (id: number) => {
        try {
            await fetch(`/api/brands?id=${id}`, { method: 'DELETE' });
            await fetchBrands();
            showToast('🗑️ Brend o\'chirildi!');
        } catch { showToast('❌ Xatolik!'); }
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            await fetchProducts();
            showToast('🗑️ Mahsulot o\'chirildi!');
        } catch { showToast('❌ Xatolik!'); }
    };

    const handleDeleteOrder = async (id: string) => {
        try {
            await fetch(`/api/orders?id=${id}`, { method: 'DELETE' });
            await fetchOrders();
            showToast('🗑️ Buyurtma o\'chirildi!');
        } catch { showToast('❌ Xatolik!'); }
    };

    const handleSeedCategories = async () => {
        if (!confirm('Barcha standart kategoriyalarni qayta tiklashni xohlaysizmi?')) return;
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'seed' }),
            });
            if (!res.ok) throw new Error('Seeding failed');
            await fetchCategories();
            showToast('✅ Kategoriyalar muvaffaqiyatli tiklandi!');
        } catch { showToast('❌ Xatolik yuz berdi!'); }
    };

    const handleOrderStatus = async (id: string, status: string) => {
        try {
            await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            await fetchOrders();
            showToast('✅ Status yangilandi!');
        } catch { showToast('❌ Xatolik!'); }
    };

    // ── Installment Plan handlers ──
    const handleAddPlan = async () => {
        if (!newPlanMonths || parseInt(newPlanMonths) < 1) {
            showToast('❌ Oy sonini kiriting!'); return;
        }
        try {
            const res = await fetch('/api/installment-plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    months: parseInt(newPlanMonths),
                    interestPercent: parseFloat(newPlanPercent) || 0,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Server xatosi');

            await fetchInstallmentPlans();
            setNewPlanMonths(''); setNewPlanPercent(''); setEditingPlanId(null);
            showToast('✅ Reja qo\'shildi!');
        } catch (err: any) { 
            console.error('Rejani saqlashda xato:', err);
            showToast(`❌ Xatolik: ${err.message || 'Server xatosi'}`); 
        }
    };

    const handleDeletePlan = async (id: number) => {
        try {
            await fetch(`/api/installment-plans?id=${id}`, { method: 'DELETE' });
            await fetchInstallmentPlans();
            showToast('🗑️ Reja o\'chirildi!');
        } catch { showToast('❌ Xatolik!'); }
    };

    const handleTogglePlan = async (plan: any) => {
        try {
            await fetch('/api/installment-plans', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: plan.id, isActive: !plan.isActive }),
            });
            await fetchInstallmentPlans();
            showToast(plan.isActive ? '⏸️ Reja o\'chirildi' : '✅ Reja yoqildi');
        } catch { showToast('❌ Xatolik!'); }
    };

    const currentImage = imageMode === 'upload' ? newProduct.imagePreview : newProduct.imageUrl;
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.brand.toLowerCase().includes(searchQ.toLowerCase());
        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
        return matchesSearch && matchesCat;
    });

    const totalRevenue = orders.reduce((s, o) => s + o.amount, 0);

    // ── Excel Import Handlers ──
    const handleExcelFileSelect = (file: File) => {
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            showToast('❌ Faqat .xlsx yoki .xls fayl yuklang!');
            return;
        }
        setExcelFile(file);
        setExcelResult(null);
    };

    const handleExcelImport = async () => {
        if (!excelFile) { showToast('❌ Avval fayl tanlang!'); return; }
        setExcelImporting(true);
        setExcelResult(null);
        try {
            const reader = new FileReader();
            const base64 = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(excelFile);
            });
            const res = await fetch('/api/import-excel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ base64 }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Server xatosi');
            setExcelResult(data);
            if (data.success > 0) {
                await fetchProducts();
                showToast(`✅ ${data.success} ta mahsulot import qilindi!`);
            }
        } catch (err: any) {
            showToast(`❌ Import xatosi: ${err.message}`);
            setExcelResult({ error: err.message });
        } finally {
            setExcelImporting(false);
        }
    };

    const handleDownloadTemplate = () => {
        const XLSX_LIB = require('xlsx');
        const templateData = [
            {
                'Mahsulot nomi': 'iPhone 15 Pro Max 256GB',
                'Narxi': 17990000,
                'Kategoriya': 'Smartfonlar',
                'Rasm URL': 'https://example.com/iphone15.jpg',
                'Brend': 'Apple',
                'Tavsifi': '256GB, Titanium, A17 Pro chip',
            },
            {
                'Mahsulot nomi': 'Samsung Galaxy S24 Ultra',
                'Narxi': 14990000,
                'Kategoriya': 'Smartfonlar',
                'Rasm URL': 'https://example.com/samsung-s24.jpg',
                'Brend': 'Samsung',
                'Tavsifi': '512GB, AI Features, S Pen',
            },
        ];
        const ws = XLSX_LIB.utils.json_to_sheet(templateData);
        // Ustun kengliklarini sozlash
        ws['!cols'] = [
            { wch: 35 }, // Mahsulot nomi
            { wch: 15 }, // Narxi
            { wch: 20 }, // Kategoriya
            { wch: 45 }, // Rasm URL
            { wch: 15 }, // Brend
            { wch: 40 }, // Tavsifi
        ];
        const wb = XLSX_LIB.utils.book_new();
        XLSX_LIB.utils.book_append_sheet(wb, ws, 'Mahsulotlar');
        XLSX_LIB.writeFile(wb, 'mahsulotlar_shablon.xlsx');
        showToast('✅ Shablon yuklab olindi!');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Toast */}
            {toast && (
                <div className="fixed top-4 right-4 z-[100] bg-[#1a1a1a] border border-yellow-400/40 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium animate-fadeIn flex items-center gap-2">
                    {toast}
                </div>
            )}

            {/* ── TOP NAV ── */}
            <header className="bg-[#0a0a0a] border-b border-[#1a1a1a] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-4 py-3 border-b border-[#1a1a1a]">
                        <Link href="/" className="text-xl font-extrabold flex-shrink-0">
                            <span className="text-white">ashinde</span>
                        </Link>
                        <div className="flex items-center flex-1 max-w-md bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                            <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                                placeholder="Mahsulot qidirish..."
                                className="flex-1 px-4 py-2.5 bg-transparent text-white text-sm outline-none placeholder-gray-600" />
                            <button className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 transition-colors">
                                <Search size={16} className="text-black" />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 md:gap-5 ml-auto">
                            <button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-yellow-400 transition-colors text-[10px] md:text-xs">
                                <Heart size={20} /><span className="hidden sm:inline">Sevimlilar</span>
                            </button>
                            <button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-yellow-400 transition-colors text-[10px] md:text-xs">
                                <ShoppingCart size={20} /><span className="hidden sm:inline">Savatcha</span>
                            </button>
                            <button onClick={logout}
                                className="flex flex-col items-center gap-0.5 text-red-400 hover:text-red-300 transition-colors text-[10px] md:text-xs">
                                <X size={20} /><span className="hidden sm:inline">Chiqish</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 py-2 overflow-x-auto hide-scrollbar">
                        {TABS.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:text-white'
                                    }`}>{tab.label}</button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">

                {/* ── DASHBOARD ── */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-xl font-bold">📊 Boshqaruv</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { label: 'Mahsulotlar', value: products.length, color: 'text-yellow-400' },
                                { label: 'Buyurtmalar', value: orders.length, color: 'text-yellow-400' },
                                { label: 'Yangi buyurtma', value: orders.filter(o => o.status === 'new').length, color: 'text-green-400' },
                                { label: 'Jami daromad', value: formatPrice(totalRevenue), color: 'text-yellow-400' },
                            ].map(s => (
                                <div key={s.label} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 flex flex-col items-center justify-center gap-1">
                                    <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                                    <p className="text-gray-500 text-sm">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h3 className="text-base font-bold mb-3">🔥 So'nggi buyurtmalar</h3>
                            <div className="space-y-2">
                                {orders.slice(0, 3).map(o => (
                                    <div key={o.id} className="bg-[#111] border border-[#1e1e1e] rounded-2xl px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <p className="text-white font-semibold">{o.customer}</p>
                                            <p className="text-gray-500 text-[11px]">📞 {o.phone} · {o.date}</p>
                                            <p className="text-gray-600 text-[11px]">📦 {o.product} {o.installment > 1 ? `· ${o.installment} oy` : ''}</p>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-2 border-t border-[#1e1e1e] sm:border-0 pt-2 sm:pt-0">
                                            <span className="text-yellow-400 font-bold text-sm whitespace-nowrap">{formatPrice(o.amount)}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap ${o.status === 'new' ? 'bg-yellow-400 text-black' : o.status === 'processing' ? 'bg-red-500 text-white' : o.status === 'delivering' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}>
                                                {o.status === 'new' ? 'Yangi' : o.status === 'processing' ? '❌ Bekor' : o.status === 'delivering' ? '🚚 Yo\'lda' : '✅ Tayyor'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-base font-bold mb-3">⭐ Top mahsulotlar</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {products.filter(p => p.isFeatured).slice(0, 4).map(p => (
                                    <div key={p.id} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-3">
                                        <div className="aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden mb-2">
                                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                        </div>
                                        <p className="text-white text-xs font-medium line-clamp-1">{p.name}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-yellow-400 text-xs font-bold">{formatPrice(p.price)}</span>
                                            <span className="flex items-center gap-0.5 text-gray-500 text-xs">
                                                <Star size={9} className="fill-yellow-400 text-yellow-400" />{p.rating}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── PRODUCTS ── */}
                {activeTab === 'products' && (
                    <div className="animate-fadeIn space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <h2 className="text-xl font-bold">Mahsulotlar ({filteredProducts.length})</h2>
                            <div className="flex items-center gap-2">
                                <select 
                                    value={selectedCategory} 
                                    onChange={e => setSelectedCategory(e.target.value)}
                                    className="bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-3 py-2 text-sm focus:border-yellow-400 outline-none"
                                >
                                    <option value="all">Barcha kategoriyalar</option>
                                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                                </select>
                                <button onClick={() => { setShowAddForm(!showAddForm); setEditProduct(null); setNewProduct(emptyProduct); }}
                                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap">
                                    <Plus size={16} /> Qo'shish
                                </button>
                            </div>
                        </div>

                        {/* ── ADD / EDIT FORM ── */}
                        {showAddForm && (
                            <div className="bg-[#111] border border-yellow-400/30 rounded-2xl p-6 animate-fadeIn">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-bold text-base text-yellow-400">
                                        {editProduct ? '✏️ Mahsulotni tahrirlash' : '➕ Yangi mahsulot qo\'shish'}
                                    </h3>
                                    <button onClick={() => { setShowAddForm(false); setEditProduct(null); setNewProduct(emptyProduct); }}
                                        className="text-gray-500 hover:text-white w-8 h-8 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* LEFT: text fields */}
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-gray-400 text-xs block mb-1">Nomi (UZ) *</label>
                                                <input value={newProduct.name}
                                                    onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                                                    placeholder="iPhone 15 Pro..."
                                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors" />
                                            </div>
                                            <div>
                                                <label className="text-gray-400 text-xs block mb-1">Nomi (RU)</label>
                                                <input value={newProduct.nameRu}
                                                    onChange={e => setNewProduct(p => ({ ...p, nameRu: e.target.value }))}
                                                    placeholder="iPhone 15 Pro..."
                                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-gray-400 text-xs block mb-1">Brend</label>
                                                <select value={newProduct.brand}
                                                    onChange={e => setNewProduct(p => ({ ...p, brand: e.target.value }))}
                                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:border-yellow-400 outline-none transition-colors">
                                                    <option value="">Tanlang...</option>
                                                    {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-gray-400 text-xs block mb-1">Kategoriya</label>
                                                <select value={newProduct.category}
                                                    onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:border-yellow-400 outline-none transition-colors">
                                                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-gray-400 text-xs block mb-1">Narx (so'm) *</label>
                                                <input type="number" value={newProduct.price}
                                                    onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                                                    placeholder="12990000"
                                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors" />
                                            </div>
                                            <div>
                                                <label className="text-gray-400 text-xs block mb-1">Eski narx (ixtiyoriy)</label>
                                                <input type="number" value={newProduct.oldPrice}
                                                    onChange={e => setNewProduct(p => ({ ...p, oldPrice: e.target.value }))}
                                                    placeholder="15990000"
                                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-gray-400 text-xs block mb-2">
                                                💳 Kredit muddati (oy) — Oylik: {newProduct.price
                                                    ? formatPrice(calcInstallment(parseInt(newProduct.price || '0'), newProduct.installmentMonths))
                                                    : '—'}
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {installmentPlans.length === 0 ? (
                                                    <p className="text-red-400 text-[10px]">⚠️ Avval "Bo'lib to'lash" bo'limida reja qo'shing!</p>
                                                ) : (
                                                    [...installmentPlans].sort((a, b) => a.months - b.months).map(plan => (
                                                        <button key={plan.id} type="button"
                                                            onClick={() => setNewProduct(p => ({ ...p, installmentMonths: plan.months }))}
                                                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${newProduct.installmentMonths === plan.months
                                                                    ? 'bg-yellow-400 text-black border-yellow-400'
                                                                    : 'bg-[#1a1a1a] text-gray-400 border-[#2a2a2a] hover:border-yellow-400/50 hover:text-white'
                                                                }`}>
                                                            {plan.months} oy
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                            {newProduct.price && installmentPlans.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-gray-600">
                                                    {[...installmentPlans].sort((a, b) => a.months - b.months).slice(0, 4).map(plan => (
                                                        <span key={plan.id} className="bg-[#1a1a1a] px-2 py-1 rounded-lg">
                                                            {plan.months}oy: {formatPrice(calcInstallment(parseInt(newProduct.price || '0'), plan.months))}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-gray-400 text-xs block mb-1">Chegirma %</label>
                                            <input type="number" value={newProduct.discountPercent}
                                                onChange={e => setNewProduct(p => ({ ...p, discountPercent: e.target.value }))}
                                                placeholder="10" min="0" max="99"
                                                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors" />
                                        </div>

                                        {/* 🏦 Kredit foiz ustamasi */}
                                        <div className="mt-1 p-4 bg-[#0d1117] rounded-xl border border-blue-500/20">
                                            <label className="text-blue-400 text-xs font-bold block mb-2">🏦 Kredit foiz ustamasi (%)</label>
                                            <p className="text-gray-500 text-[10px] mb-2">Mahsulotni kreditga olganda naqd narxdan qancha % qimmatroq bo'ladi</p>
                                            <input type="number" value={newProduct.creditMarkupPercent}
                                                onChange={e => setNewProduct(p => ({ ...p, creditMarkupPercent: e.target.value }))}
                                                placeholder="Masalan: 15 (15% ustama)" min="0" max="100"
                                                className="w-full bg-[#1a1a1a] border border-blue-500/30 text-white rounded-xl px-3 py-2.5 text-sm focus:border-blue-400 outline-none placeholder-gray-600 transition-colors" />
                                            {newProduct.price && newProduct.creditMarkupPercent && (
                                                <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                                                    <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-lg">
                                                        Naqd: {formatPrice(parseInt(newProduct.price))}
                                                    </span>
                                                    <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-lg">
                                                        Kredit: {formatPrice(calcCreditPrice(parseInt(newProduct.price), parseInt(newProduct.creditMarkupPercent)))}
                                                    </span>
                                                    <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-lg">
                                                        +{formatPrice(calcCreditPrice(parseInt(newProduct.price), parseInt(newProduct.creditMarkupPercent)) - parseInt(newProduct.price))} ustama
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-4">
                                            {[
                                                { key: 'inStock', label: 'Mavjud' },
                                                { key: 'isNew', label: 'Yangi' },
                                                { key: 'isFeatured', label: 'Featured' },
                                            ].map(({ key, label }) => (
                                                <label key={key} className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" checked={(newProduct as any)[key]}
                                                        onChange={e => setNewProduct(p => ({ ...p, [key]: e.target.checked }))}
                                                        className="accent-yellow-400 w-4 h-4" />
                                                    <span className="text-gray-300 text-sm">{label}</span>
                                                </label>
                                            ))}
                                        </div>

                                        {/* ── SPECS (Xususiyatlar) Builder ── */}
                                        <div className="mt-4 pt-4 border-t border-[#1e1e1e]">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">📋 Xususiyatlar (Specs)</label>
                                                <div className="flex items-center gap-2">
                                                    <button type="button"
                                                        onClick={handleGenerateSpecs}
                                                        disabled={isGeneratingSpecs}
                                                        className="text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 disabled:opacity-50">
                                                        {isGeneratingSpecs ? '⏳ Yuklanmoqda...' : '✨ Yuklash'}
                                                    </button>
                                                    <button type="button"
                                                        onClick={() => setNewProduct(p => ({ ...p, specs: [...p.specs, { key: '', value: '' }] }))}
                                                        className="text-xs bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1">
                                                        <Plus size={12} /> Qo'shish
                                                    </button>
                                                </div>
                                            </div>
                                            {newProduct.specs.length === 0 && (
                                                <p className="text-gray-600 text-xs italic">Xususiyat qo'shish uchun yuqoridagi tugmani bosing (masalan: RAM = 8 GB)</p>
                                            )}
                                            <div className="space-y-2">
                                                {newProduct.specs.map((spec, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <input
                                                            value={spec.key}
                                                            onChange={e => {
                                                                const specs = [...newProduct.specs];
                                                                specs[idx] = { ...specs[idx], key: e.target.value };
                                                                setNewProduct(p => ({ ...p, specs }));
                                                            }}
                                                            placeholder="Nomi (masalan: RAM)"
                                                            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors"
                                                        />
                                                        <span className="text-gray-600">=</span>
                                                        <input
                                                            value={spec.value}
                                                            onChange={e => {
                                                                const specs = [...newProduct.specs];
                                                                specs[idx] = { ...specs[idx], value: e.target.value };
                                                                setNewProduct(p => ({ ...p, specs }));
                                                            }}
                                                            placeholder="Qiymati (masalan: 8 GB)"
                                                            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors"
                                                        />
                                                        <button type="button"
                                                            onClick={() => {
                                                                const specs = newProduct.specs.filter((_, i) => i !== idx);
                                                                setNewProduct(p => ({ ...p, specs }));
                                                            }}
                                                            className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 flex items-center justify-center shrink-0 transition-colors">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT: image */}
                                    <div className="space-y-3">
                                        <label className="text-gray-400 text-xs block">Mahsulot rasmi</label>
                                        <div className="flex bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden w-fit">
                                            {[{ v: 'url', l: '🔗 URL' }, { v: 'upload', l: '📁 Fayl' }].map(m => (
                                                <button key={m.v} onClick={() => setImageMode(m.v as 'url' | 'upload')}
                                                    className={`px-4 py-2 text-xs font-semibold transition-colors ${imageMode === m.v ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'}`}>
                                                    {m.l}
                                                </button>
                                            ))}
                                        </div>

                                        {imageMode === 'url' ? (
                                            <input value={newProduct.imageUrl}
                                                onChange={e => setNewProduct(p => ({ ...p, imageUrl: e.target.value }))}
                                                placeholder="https://example.com/image.jpg"
                                                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors" />
                                        ) : (
                                            <>
                                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                                <button onClick={() => fileInputRef.current?.click()}
                                                    className="w-full border-2 border-dashed border-[#333] hover:border-yellow-400 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-all">
                                                    <Upload size={28} />
                                                    <span className="text-sm font-medium">Rasm tanlang</span>
                                                    <span className="text-xs text-gray-600">PNG, JPG, WEBP — max 5MB</span>
                                                </button>
                                            </>
                                        )}

                                        {/* Preview */}
                                        <div className="aspect-square bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] flex items-center justify-center overflow-hidden">
                                            {currentImage ? (
                                                <img src={currentImage} alt="preview" className="w-full h-full object-contain p-4" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-gray-700">
                                                    <ImageIcon size={40} />
                                                    <span className="text-xs">Rasm ko'rinishi</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Price preview card */}
                                        {newProduct.price && (() => {
                                            const cashPrice = parseInt(newProduct.price);
                                            const markup = newProduct.creditMarkupPercent ? parseInt(newProduct.creditMarkupPercent) : 0;
                                            const creditPrice = calcCreditPrice(cashPrice, markup);
                                            return (
                                                <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a] space-y-2">
                                                    <p className="text-gray-400 text-xs mb-2">Ko'rinish:</p>
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <p className="text-gray-500 text-[10px]">💵 Naqd narx:</p>
                                                            <p className="text-white font-bold">{formatPrice(cashPrice)}</p>
                                                        </div>
                                                        {markup > 0 && (
                                                            <div className="border-l border-[#2a2a2a] pl-3">
                                                                <p className="text-blue-400 text-[10px]">🏦 Kreditda (+{markup}%):</p>
                                                                <p className="text-blue-400 font-bold">{formatPrice(creditPrice)}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-yellow-400 text-xs mt-1">
                                                        💳 0-0-{newProduct.installmentMonths}: {formatPrice(calcInstallment(markup > 0 ? creditPrice : cashPrice, newProduct.installmentMonths))}/oy
                                                    </p>
                                                    {newProduct.discountPercent && (
                                                        <p className="text-green-400 text-xs">−{newProduct.discountPercent}% chegirma</p>
                                                    )}
                                                </div>
                                            );
                                        })()}

                                        {/* ── EXTRA IMAGES (2-3 ta qo'shimcha rasm) ── */}
                                        <div className="mt-4 pt-4 border-t border-[#1e1e1e]">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">🖼️ Qo'shimcha rasmlar (max 3)</label>
                                                {newProduct.extraImages.length < 3 && (
                                                    <button type="button"
                                                        onClick={() => setNewProduct(p => ({ ...p, extraImages: [...p.extraImages, ''] }))}
                                                        className="text-xs bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1">
                                                        <Plus size={12} /> Rasm qo'shish
                                                    </button>
                                                )}
                                            </div>
                                            {newProduct.extraImages.length === 0 && (
                                                <p className="text-gray-600 text-xs italic">Mahsulot uchun qo'shimcha rasmlar (mahsulot sahifasida gallery ko'rinadi)</p>
                                            )}
                                            <div className="space-y-2">
                                                {newProduct.extraImages.map((img, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <input
                                                            value={img}
                                                            onChange={e => {
                                                                const imgs = [...newProduct.extraImages];
                                                                imgs[idx] = e.target.value;
                                                                setNewProduct(p => ({ ...p, extraImages: imgs }));
                                                            }}
                                                            placeholder={`https://... (rasm ${idx + 2})`}
                                                            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors"
                                                        />
                                                        {img && <img src={img} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#333]" />}
                                                        <button type="button"
                                                            onClick={() => setNewProduct(p => ({ ...p, extraImages: p.extraImages.filter((_, i) => i !== idx) }))}
                                                            className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 flex items-center justify-center shrink-0 transition-colors">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* ── RANG VARIANTLARI ── */}
                                        <div className="mt-4 pt-4 border-t border-[#1e1e1e]">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider">🎨 Rang variantlari</label>
                                                <button type="button"
                                                    onClick={() => setNewProduct(p => ({ ...p, variants: [...p.variants, { color: '#000000', colorName: '', colorNameRu: '', image: '' }] }))}
                                                    className="text-xs bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1">
                                                    <Plus size={12} /> Rang qo'shish
                                                </button>
                                            </div>
                                            {newProduct.variants.length === 0 && (
                                                <p className="text-gray-600 text-xs italic">Masalan: Qora (#000000), Oq (#ffffff), Qizil (#ff0000)</p>
                                            )}
                                            <div className="space-y-3">
                                                {newProduct.variants.map((v, idx) => (
                                                    <div key={idx} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={v.color}
                                                                onChange={e => { const vs = [...newProduct.variants]; vs[idx] = { ...vs[idx], color: e.target.value }; setNewProduct(p => ({ ...p, variants: vs })); }}
                                                                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                                                            <input value={v.colorName}
                                                                onChange={e => { const vs = [...newProduct.variants]; vs[idx] = { ...vs[idx], colorName: e.target.value }; setNewProduct(p => ({ ...p, variants: vs })); }}
                                                                placeholder="Nomi UZ (masalan: Qora)"
                                                                className="flex-1 bg-[#111] border border-[#333] text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400 outline-none placeholder-gray-600" />
                                                            <input value={v.colorNameRu}
                                                                onChange={e => { const vs = [...newProduct.variants]; vs[idx] = { ...vs[idx], colorNameRu: e.target.value }; setNewProduct(p => ({ ...p, variants: vs })); }}
                                                                placeholder="Nomi RU (Чёрный)"
                                                                className="flex-1 bg-[#111] border border-[#333] text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400 outline-none placeholder-gray-600" />
                                                            <button type="button"
                                                                onClick={() => setNewProduct(p => ({ ...p, variants: p.variants.filter((_, i) => i !== idx) }))}
                                                                className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 flex items-center justify-center shrink-0">
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center gap-2 w-full">
                                                            <input value={v.image}
                                                                onChange={e => { const vs = [...newProduct.variants]; vs[idx] = { ...vs[idx], image: e.target.value }; setNewProduct(p => ({ ...p, variants: vs })); }}
                                                                placeholder="Bu rang uchun rasm URL yoki fayl yuklang"
                                                                className="flex-1 bg-[#111] border border-[#333] text-white rounded-lg px-3 py-2 text-sm focus:border-yellow-400 outline-none placeholder-gray-600" />
                                                            <label className="cursor-pointer shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 text-xs font-bold transition-colors">
                                                                <Upload size={12} /> Fayl
                                                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (!file) return;
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = async () => {
                                                                        try {
                                                                            const res = await fetch('/api/upload', {
                                                                                method: 'POST',
                                                                                headers: { 'Content-Type': 'application/json' },
                                                                                body: JSON.stringify({ base64: reader.result }),
                                                                            });
                                                                            const data = await res.json();
                                                                            if (data.url) {
                                                                                const vs = [...newProduct.variants];
                                                                                vs[idx] = { ...vs[idx], image: data.url };
                                                                                setNewProduct(p => ({ ...p, variants: vs }));
                                                                                showToast('✅ Rasm yuklandi!');
                                                                            }
                                                                        } catch { showToast('❌ Rasm yuklanmadi!'); }
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }} />
                                                            </label>
                                                            {v.image && <img src={v.image} alt={v.colorName} className="w-12 h-12 rounded-lg object-cover border border-[#333] shrink-0" />}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="flex gap-3 mt-5 pt-5 border-t border-[#1e1e1e]">
                                    <button onClick={handleAddProduct}
                                        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
                                        <Check size={15} /> {editProduct ? 'Saqlash' : 'Qo\'shish'}
                                    </button>
                                    <button onClick={() => { setShowAddForm(false); setEditProduct(null); setNewProduct(emptyProduct); }}
                                        className="border border-[#2a2a2a] text-gray-400 hover:text-white px-5 py-2.5 rounded-xl text-sm transition-colors">
                                        Bekor
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Products grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {filteredProducts.map(p => (
                                <div key={p.id} className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden hover:border-yellow-400/30 transition-all group">
                                    <div className="aspect-square bg-[#1a1a1a] overflow-hidden relative">
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        {p.installmentMonths && (
                                            <span className="absolute top-2 left-2 bg-yellow-400 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                                0-0-{p.installmentMonths}
                                            </span>
                                        )}
                                        {p.discountPercent && (
                                            <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                                −{p.discountPercent}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-white text-xs font-medium line-clamp-1">{p.name}</p>
                                        <p className="text-gray-600 text-xs">{p.brand}</p>
                                        <p className="text-gray-500 text-[10px] truncate">{categories.find(c => c.slug === p.category)?.name || p.category}</p>
                                        <p className="text-yellow-400 text-xs font-bold mt-0.5">{formatPrice(p.price)}</p>
                                        {p.installmentMonths && (
                                            <p className="text-gray-500 text-[10px]">
                                                {p.installmentMonths}oy: {formatPrice(calcInstallment(p.price, p.installmentMonths))}
                                            </p>
                                        )}
                                        <div className="flex gap-1.5 mt-2">
                                            <button onClick={() => handleEdit(p)}
                                                className="flex-1 py-1.5 bg-blue-500/10 hover:bg-blue-500/25 text-blue-400 rounded-lg flex items-center justify-center transition-colors">
                                                <Pencil size={12} />
                                            </button>
                                            <button onClick={() => handleDeleteProduct(p.id)}
                                                className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg flex items-center justify-center transition-colors">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── ORDERS ── */}
                {activeTab === 'orders' && (
                    <div className="animate-fadeIn space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h2 className="text-xl font-bold">Buyurtmalar ({orders.length})</h2>
                            <span className="text-yellow-400 text-sm font-bold bg-yellow-400/10 px-3 py-1 rounded-full w-fit">Jami: {formatPrice(totalRevenue)}</span>
                        </div>

                        {orders.length === 0 ? (
                            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-12 text-center">
                                <AlertCircle size={40} className="mx-auto text-gray-700 mb-3" />
                                <p className="text-gray-500">Hozircha buyurtmalar yo'q</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.map(o => (
                                    <div key={o.id} className="bg-[#111] border border-[#1e1e1e] rounded-2xl px-5 py-4">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="text-yellow-400 font-mono font-bold text-sm">{o.id}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${o.status === 'new' ? 'bg-yellow-400 text-black'
                                                            : o.status === 'processing' ? 'bg-red-500 text-white'
                                                                : o.status === 'delivering' ? 'bg-orange-500 text-white'
                                                                    : 'bg-green-500 text-white'
                                                        }`}>
                                                        {o.status === 'new' ? 'Yangi' : o.status === 'processing' ? '❌ Yetkazib berilmadi' : o.status === 'delivering' ? '🚚 Yetkazib berilyapti' : '✅ Yetkazildi'}
                                                    </span>
                                                </div>
                                                <p className="text-white font-semibold">{o.customer}</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1 mb-2">
                                                    <p className="text-gray-500 text-[11px]">📞 {o.phone}</p>
                                                    <p className="text-gray-500 text-[11px]">📅 {o.date}</p>
                                                    <p className="text-gray-400 text-[11px]">📦 {o.product}</p>
                                                    <p className="text-gray-400 text-[11px]">💳 {o.paymentMethod || 'Noma\'lum'}</p>
                                                    <p className="text-yellow-400/80 text-[11px] font-medium">📍 {o.region}, {o.district}</p>
                                                    <p className="text-gray-500 text-[11px]">🏠 {o.address} {o.floor ? `· ${o.floor}-qavat` : ''}</p>
                                                    <p className="text-blue-400 text-[11px]">🚚 {o.deliveryMethod === 'delivery' ? 'Yetkazib berish' : 'Do\'kondan olib ketish'} ({o.deliveryTerm})</p>
                                                </div>
                                                {o.installment > 1 && (
                                                    <p className="text-yellow-400 text-[11px] font-semibold">
                                                        🏦 {o.installment} oylik muddatli to'lov — {formatPrice(Math.round(o.amount / o.installment))}/oy
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2 min-w-[140px]">
                                                <p className="text-yellow-400 font-extrabold text-lg">{formatPrice(o.amount)}</p>

                                                {/* Status actions */}
                                                <div className="flex flex-col gap-1.5">
                                                    {o.status === 'new' && (
                                                        <button onClick={() => handleOrderStatus(o.id, 'processing')}
                                                            className="bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                                                            <Check size={12} /> Tasdiqlash
                                                        </button>
                                                    )}
                                                    {o.status === 'processing' && (
                                                        <button onClick={() => handleOrderStatus(o.id, 'delivering')}
                                                            className="bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                                                            🚚 Yetkazib berish
                                                        </button>
                                                    )}
                                                    {o.status === 'delivering' && (
                                                        <>
                                                            {o.address && o.address !== "Ko'rsatilmagan" && (
                                                                <a href={o.address.match(/^[\d.-]+,\s*[\d.-]+$/) ? `https://www.google.com/maps?q=${o.address}` : `https://www.google.com/maps/search/${encodeURIComponent(o.address)}`}
                                                                    target="_blank" rel="noopener noreferrer"
                                                                    className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                                                                    📍 Xaritada ko'rish
                                                                </a>
                                                            )}
                                                            <button onClick={() => handleOrderStatus(o.id, 'delivered')}
                                                                className="bg-green-500 hover:bg-green-400 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                                                                <Check size={12} /> Yetkazildi
                                                            </button>
                                                        </>
                                                    )}
                                                    <button onClick={() => handleDeleteOrder(o.id)}
                                                        className="bg-red-500/10 hover:bg-red-500/25 text-red-400 text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-red-500/20">
                                                        <Trash2 size={12} /> O'chirish
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── CATEGORIES ── */}
                {activeTab === 'categories' && (
                    <div className="animate-fadeIn">
                        <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold">Kategoriyalar ({categories.length})</h2>
                                <button onClick={handleSeedCategories}
                                    className="text-[10px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all">
                                    🔄 Standart kategoriyalarni tiklash
                                </button>
                            </div>
                            <button onClick={() => { setShowAddCategoryForm(!showAddCategoryForm); setEditCategory(null); setNewCategory(emptyCategory); }}
                                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
                                <Plus size={16} /> Qo'shish
                            </button>
                        </div>

                        {/* ── ADD / EDIT CATEGORY FORM ── */}
                        {showAddCategoryForm && (
                            <div className="bg-[#111] border border-yellow-400/30 rounded-2xl p-6 mb-5 animate-fadeIn">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-bold text-base text-yellow-400">
                                        {editCategory ? '✏️ Kategoriyani tahrirlash' : '➕ Yangi kategoriya qo\'shish'}
                                    </h3>
                                    <button onClick={() => { setShowAddCategoryForm(false); setEditCategory(null); setNewCategory(emptyCategory); }}
                                        className="text-gray-500 hover:text-white w-8 h-8 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* LEFT: text fields */}
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-gray-400 text-xs block mb-1">Nomi (UZ) *</label>
                                                <input value={newCategory.name}
                                                    onChange={e => setNewCategory(c => ({ ...c, name: e.target.value }))}
                                                    placeholder="Smartfonlar..."
                                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors" />
                                            </div>
                                            <div>
                                                <label className="text-gray-400 text-xs block mb-1">Nomi (RU) *</label>
                                                <input value={newCategory.nameRu}
                                                    onChange={e => setNewCategory(c => ({ ...c, nameRu: e.target.value }))}
                                                    placeholder="Смартфоны..."
                                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-gray-400 text-xs block mb-1">Slug (unique) *</label>
                                                <input value={newCategory.slug}
                                                    onChange={e => setNewCategory(c => ({ ...c, slug: e.target.value }))}
                                                    placeholder="smartphones"
                                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors" />
                                            </div>
                                            <div>
                                                <label className="text-gray-400 text-xs block mb-1">Ikonka (emoji)</label>
                                                <input value={newCategory.icon}
                                                    onChange={e => setNewCategory(c => ({ ...c, icon: e.target.value }))}
                                                    placeholder="📱"
                                                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-gray-400 text-xs block mb-1">Rang (hex turi)</label>
                                            <div className="flex items-center gap-3">
                                                <input type="color" value={newCategory.color || '#ffffff'}
                                                    onChange={e => setNewCategory(c => ({ ...c, color: e.target.value }))}
                                                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-none outline-none" />
                                                <input value={newCategory.color}
                                                    onChange={e => setNewCategory(c => ({ ...c, color: e.target.value }))}
                                                    placeholder="#3B82F6"
                                                    className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT: image */}
                                    <div className="space-y-3">
                                        <label className="text-gray-400 text-xs block">Kategoriya rasmi</label>
                                        <div className="flex bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden w-fit">
                                            {[{ v: 'url', l: '🔗 URL' }, { v: 'upload', l: '📁 Fayl' }].map(m => (
                                                <button key={m.v} onClick={() => setCatImageMode(m.v as 'url' | 'upload')}
                                                    className={`px-4 py-2 text-xs font-semibold transition-colors ${catImageMode === m.v ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'}`}>
                                                    {m.l}
                                                </button>
                                            ))}
                                        </div>

                                        {catImageMode === 'url' ? (
                                            <input value={newCategory.imageUrl}
                                                onChange={e => setNewCategory(c => ({ ...c, imageUrl: e.target.value }))}
                                                placeholder="https://example.com/image.jpg"
                                                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors" />
                                        ) : (
                                            <>
                                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCategoryFileChange} className="hidden" />
                                                <button onClick={() => fileInputRef.current?.click()}
                                                    className="w-full border-2 border-dashed border-[#333] hover:border-yellow-400 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-all">
                                                    <Upload size={28} />
                                                    <span className="text-sm font-medium">Rasm tanlang</span>
                                                    <span className="text-xs text-gray-600">PNG, JPG, WEBP</span>
                                                </button>
                                            </>
                                        )}

                                        {/* Preview */}
                                        <div className="aspect-[2/1] bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] flex items-center justify-center overflow-hidden">
                                            {(catImageMode === 'upload' ? newCategory.imagePreview : newCategory.imageUrl) ? (
                                                <img src={catImageMode === 'upload' ? newCategory.imagePreview : newCategory.imageUrl} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-gray-700">
                                                    <ImageIcon size={40} />
                                                    <span className="text-xs">Rasm ko'rinishi</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-5 pt-5 border-t border-[#1e1e1e]">
                                    <button onClick={handleAddCategory}
                                        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
                                        <Check size={15} /> {editCategory ? 'Saqlash' : 'Qo\'shish'}
                                    </button>
                                    <button onClick={() => { setShowAddCategoryForm(false); setEditCategory(null); setNewCategory(emptyCategory); }}
                                        className="border border-[#2a2a2a] text-gray-400 hover:text-white px-5 py-2.5 rounded-xl text-sm transition-colors">
                                        Bekor
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {categories.map(cat => (
                                <div key={cat.id} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 hover:border-yellow-400/40 transition-colors relative group">
                                    {cat.image && (
                                        <div className="absolute inset-0 opacity-20 overflow-hidden rounded-2xl">
                                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="relative z-10">
                                        <p className="text-4xl mb-3">{cat.icon || '📁'}</p>
                                        <p className="text-white font-semibold">{cat.name}</p>
                                        <p className="text-gray-500 text-xs">{cat.nameRu}</p>
                                        <p className="text-yellow-400 text-xs font-bold mt-2">
                                            {products.filter(p => p.category === cat.slug).length} ta mahsulot
                                        </p>
                                        
                                        <div className="flex gap-1.5 mt-3 pt-3 border-t border-gray-800">
                                            <button onClick={() => handleEditCategory(cat)}
                                                className="flex-1 py-1.5 bg-blue-500/10 hover:bg-blue-500/25 text-blue-400 rounded-lg flex items-center justify-center transition-colors">
                                                <Pencil size={12} />
                                            </button>
                                            <button onClick={() => handleDeleteCategory(cat.id)}
                                                className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg flex items-center justify-center transition-colors">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── BRANDS ── */}
                {activeTab === 'brands' && (
                    <div className="animate-fadeIn space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Tag size={20} className="text-yellow-400" /> Brendlar ({brands.length})</h2>
                        </div>

                        {/* Add Brand Form */}
                        <div className="bg-[#111] border border-yellow-400/30 rounded-2xl p-5">
                            <h3 className="text-yellow-400 text-sm font-bold mb-3">➕ Yangi brend qo'shish</h3>
                            <div className="flex gap-3">
                                <input
                                    value={newBrandName}
                                    onChange={e => setNewBrandName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddBrand()}
                                    placeholder="Brend nomi (masalan: Oppo, Realme...)"
                                    className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors"
                                />
                                <button onClick={handleAddBrand}
                                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-xl text-sm transition-colors">
                                    <Plus size={16} /> Qo'shish
                                </button>
                            </div>
                        </div>

                        {/* Brands Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {brands.map(brand => (
                                <div key={brand.id} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 hover:border-yellow-400/30 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-bold text-sm">{brand.name}</p>
                                            <p className="text-gray-600 text-xs mt-0.5">slug: {brand.slug}</p>
                                            <p className="text-yellow-400/70 text-xs mt-1">
                                                {products.filter(p => p.brand === brand.name).length} ta mahsulot
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteBrand(brand.id)}
                                        className="mt-3 w-full py-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs font-bold">
                                        <Trash2 size={12} /> O'chirish
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── INSTALLMENTS (Bo'lib to'lash) ── */}
                {activeTab === 'installments' && (
                    <div className="animate-fadeIn space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">💳 Bo'lib to'lash rejalar ({installmentPlans.length})</h2>
                        </div>

                        {/* Info */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                            <p className="text-blue-400 text-sm">ℹ️ Bu yerda siz bo'lib to'lash muddatlarini va har bir muddatga ustama foizni belgilaysiz. Bu sozlamalar <span className="font-bold">BARCHA mahsulotlarga</span> avtomatik qo'llaniladi.</p>
                        </div>

                        {/* Add Form */}
                        <div className="bg-[#111] border border-yellow-400/30 rounded-2xl p-5">
                            <h3 className="text-yellow-400 text-sm font-bold mb-3">➕ Yangi reja qo'shish</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-gray-400 text-xs block mb-1">Oy soni *</label>
                                    <input
                                        type="number" min="1" max="60"
                                        value={newPlanMonths}
                                        onChange={e => setNewPlanMonths(e.target.value)}
                                        placeholder="12"
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-400 text-xs block mb-1">Foiz ustama (%)</label>
                                    <input
                                        type="number" min="0" max="100" step="0.5"
                                        value={newPlanPercent}
                                        onChange={e => setNewPlanPercent(e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm focus:border-yellow-400 outline-none placeholder-gray-600 transition-colors"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button onClick={handleAddPlan}
                                        className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-xl text-sm transition-colors">
                                        <Plus size={16} /> Qo'shish
                                    </button>
                                </div>
                            </div>
                            {newPlanMonths && (
                                <p className="text-gray-500 text-xs mt-2">
                                    Masalan: 10 000 000 so'mlik tovar uchun {newPlanMonths} oyga {parseFloat(newPlanPercent) || 0}% ustama bilan oyiga ≈ {formatPrice(Math.ceil(10000000 * (1 + (parseFloat(newPlanPercent) || 0) / 100) / parseInt(newPlanMonths)))}/oy
                                </p>
                            )}
                        </div>

                        {/* Plans Grid */}
                        {installmentPlans.length === 0 ? (
                            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-12 text-center">
                                <p className="text-5xl mb-3">💳</p>
                                <p className="text-gray-500">Hozircha bo'lib to'lash rejalar yo'q</p>
                                <p className="text-gray-600 text-sm mt-1">Yuqoridagi formadan yangi reja qo'shing</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {[...installmentPlans].sort((a: any, b: any) => a.months - b.months).map((plan: any) => (
                                    <div key={plan.id} className={`bg-[#111] border rounded-2xl p-5 transition-colors relative ${plan.isActive ? 'border-yellow-400/40 hover:border-yellow-400' : 'border-[#1e1e1e] opacity-60'}`}>
                                        {/* Active badge */}
                                        <div className="absolute top-3 right-3">
                                            <button onClick={() => handleTogglePlan(plan)}
                                                className={`w-10 h-5 rounded-full transition-colors relative ${plan.isActive ? 'bg-yellow-400' : 'bg-gray-600'}`}>
                                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${plan.isActive ? 'left-5' : 'left-0.5'}`} />
                                            </button>
                                        </div>

                                        <p className="text-4xl font-extrabold text-white mb-1">{plan.months}</p>
                                        <p className="text-gray-500 text-sm">oy</p>
                                        
                                        <div className={`mt-3 inline-block px-3 py-1 rounded-lg text-sm font-bold ${plan.interestPercent === 0
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                            {plan.interestPercent === 0 ? '0% foizsiz' : `+${plan.interestPercent}% ustama`}
                                        </div>

                                        <p className="text-gray-500 text-xs mt-2">
                                            10M uchun: {formatPrice(Math.ceil(10000000 * (1 + plan.interestPercent / 100) / plan.months))}/oy
                                        </p>

                                        <div className="flex gap-1.5 mt-3 pt-3 border-t border-gray-800">
                                            <button onClick={() => handleDeletePlan(plan.id)}
                                                className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg flex items-center justify-center transition-colors text-xs font-bold gap-1">
                                                <Trash2 size={12} /> O'chirish
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── EXCEL IMPORT ── */}
                {activeTab === 'excel-import' && (
                    <div className="animate-fadeIn space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FileSpreadsheet size={22} className="text-green-400" /> Excel Import
                            </h2>
                            <button onClick={handleDownloadTemplate}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                                <Download size={16} /> Shablon yuklab olish
                            </button>
                        </div>

                        {/* Qo'llanma */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
                            <div className="flex items-start gap-3">
                                <Info size={20} className="text-blue-400 mt-0.5 shrink-0" />
                                <div>
                                    <h3 className="text-blue-400 font-bold text-sm mb-2">📖 Qanday foydalanish</h3>
                                    <ol className="text-gray-400 text-sm space-y-1.5 list-decimal list-inside">
                                        <li><span className="text-green-400 font-semibold">&quot;Shablon yuklab olish&quot;</span> tugmasini bosing</li>
                                        <li>Yuklab olingan <span className="text-yellow-400">mahsulotlar_shablon.xlsx</span> faylni oching</li>
                                        <li>Namunaviy ma&apos;lumotlarni o&apos;chirib, o&apos;z tovarlaringizni kiriting</li>
                                        <li>Faylni saqlang va shu yerga yuklang</li>
                                    </ol>
                                    <div className="mt-3 pt-3 border-t border-blue-500/20">
                                        <p className="text-gray-500 text-xs">📋 <span className="text-white">Ustunlar:</span> Mahsulot nomi* | Narxi* | Kategoriya | Rasm URL | Brend | Tavsifi</p>
                                        <p className="text-gray-500 text-xs mt-1">⚠️ <span className="text-yellow-400">*</span> — majburiy ustunlar. Rasm URL — boshqa saytdan rasm linkini qo&apos;ying.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fayl yuklash zona */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setExcelDragOver(true); }}
                            onDragLeave={() => setExcelDragOver(false)}
                            onDrop={(e) => { e.preventDefault(); setExcelDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleExcelFileSelect(f); }}
                            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                                excelDragOver
                                    ? 'border-green-400 bg-green-400/10'
                                    : excelFile
                                        ? 'border-yellow-400/50 bg-yellow-400/5'
                                        : 'border-[#2a2a2a] hover:border-green-400/50 bg-[#111]'
                            }`}
                            onClick={() => excelInputRef.current?.click()}
                        >
                            <input
                                ref={excelInputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleExcelFileSelect(f); }}
                                className="hidden"
                            />
                            {excelFile ? (
                                <div className="flex flex-col items-center gap-2">
                                    <FileSpreadsheet size={48} className="text-green-400" />
                                    <p className="text-white font-bold">{excelFile.name}</p>
                                    <p className="text-gray-500 text-sm">{(excelFile.size / 1024).toFixed(1)} KB</p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setExcelFile(null); setExcelResult(null); }}
                                        className="text-red-400 text-xs hover:text-red-300 mt-1"
                                    >Faylni olib tashlash</button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <Upload size={48} className="text-gray-600" />
                                    <p className="text-gray-400 font-medium">Excel faylni shu yerga tashlang</p>
                                    <p className="text-gray-600 text-sm">yoki bosib tanlang (.xlsx, .xls)</p>
                                </div>
                            )}
                        </div>

                        {/* Import tugmasi */}
                        {excelFile && (
                            <button
                                onClick={handleExcelImport}
                                disabled={excelImporting}
                                className={`w-full flex items-center justify-center gap-3 font-bold py-4 rounded-2xl text-base transition-all ${
                                    excelImporting
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-green-500 hover:bg-green-400 text-white'
                                }`}
                            >
                                {excelImporting ? (
                                    <><span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> Import qilinmoqda...</>
                                ) : (
                                    <><Upload size={20} /> Import qilish ({excelFile.name})</>
                                )}
                            </button>
                        )}

                        {/* Natijalar */}
                        {excelResult && !excelResult.error && (
                            <div className="space-y-4">
                                {/* Umumiy natija */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 text-center">
                                        <p className="text-3xl font-extrabold text-white">{excelResult.total}</p>
                                        <p className="text-gray-500 text-sm">Jami qatorlar</p>
                                    </div>
                                    <div className="bg-[#111] border border-green-500/30 rounded-2xl p-5 text-center">
                                        <p className="text-3xl font-extrabold text-green-400">{excelResult.success}</p>
                                        <p className="text-gray-500 text-sm">Muvaffaqiyatli</p>
                                    </div>
                                    <div className={`bg-[#111] border rounded-2xl p-5 text-center ${excelResult.errors > 0 ? 'border-red-500/30' : 'border-[#1e1e1e]'}`}>
                                        <p className={`text-3xl font-extrabold ${excelResult.errors > 0 ? 'text-red-400' : 'text-gray-600'}`}>{excelResult.errors}</p>
                                        <p className="text-gray-500 text-sm">Xatoliklar</p>
                                    </div>
                                </div>

                                {/* Batafsil jadval */}
                                {excelResult.details && excelResult.details.length > 0 && (
                                    <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden">
                                        <div className="px-5 py-3 border-b border-[#1e1e1e]">
                                            <h3 className="text-white font-bold text-sm">📋 Batafsil natijalar</h3>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-[#0a0a0a] sticky top-0">
                                                    <tr>
                                                        <th className="text-left text-gray-500 px-5 py-2 font-medium">Qator</th>
                                                        <th className="text-left text-gray-500 px-5 py-2 font-medium">Mahsulot</th>
                                                        <th className="text-left text-gray-500 px-5 py-2 font-medium">Holat</th>
                                                        <th className="text-left text-gray-500 px-5 py-2 font-medium">Izoh</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {excelResult.details.map((d: any, i: number) => (
                                                        <tr key={i} className={`border-t border-[#1a1a1a] ${d.status === 'error' ? 'bg-red-500/5' : ''}`}>
                                                            <td className="px-5 py-2.5 text-gray-400 font-mono">{d.row}</td>
                                                            <td className="px-5 py-2.5 text-white">{d.name}</td>
                                                            <td className="px-5 py-2.5">
                                                                {d.status === 'success' ? (
                                                                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-lg">✅ OK</span>
                                                                ) : (
                                                                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-lg">❌ Xato</span>
                                                                )}
                                                            </td>
                                                            <td className={`px-5 py-2.5 text-sm ${d.status === 'error' ? 'text-red-400' : 'text-gray-500'}`}>{d.message}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Xatolik */}
                        {excelResult?.error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 flex items-start gap-3">
                                <AlertCircle size={20} className="text-red-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-red-400 font-bold text-sm">Import xatosi</p>
                                    <p className="text-red-400/70 text-sm mt-1">{excelResult.error}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── USERS ── */}
                {activeTab === 'users' && (
                    <div className="animate-fadeIn">
                        <h2 className="text-xl font-bold mb-4">Foydalanuvchilar</h2>
                        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-8 text-center">
                            <p className="text-5xl mb-3">👥</p>
                            <p className="text-white font-semibold text-lg">{visitors} ta foydalanuvchi</p>
                            <p className="text-gray-500 text-sm mt-1">Unique tashrifchilar</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
