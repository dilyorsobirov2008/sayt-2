const categories = [
    { slug: 'smartphones', name: 'Smartfonlar', nameRu: 'Смартфоны', icon: '📱', color: '#3B82F6', imageUrl: '' },
    { slug: 'button-phones', name: 'Tugmali telefonlar', nameRu: 'Кнопочные телефоны', icon: '📞', color: '#6366F1', imageUrl: '' },
    { slug: 'laptops', name: 'Noutbuklar', nameRu: 'Ноутбуки', icon: '💻', color: '#8B5CF6', imageUrl: '' },
    { slug: 'blenders', name: 'Blendrlar', nameRu: 'Блендеры', icon: '🍹', color: '#EC4899', imageUrl: '' },
    { slug: 'juicers', name: 'Sharbatsiqgichlar', nameRu: 'Соковыжималки', icon: '🍊', color: '#F97316', imageUrl: '' },
    { slug: 'mixers', name: 'Mikserlar', nameRu: 'Миксеры', icon: '🥣', color: '#EF4444', imageUrl: '' },
    { slug: 'watches', name: 'Qol soatlar', nameRu: 'Наручные часы', icon: '⌚', color: '#14B8A6', imageUrl: '' },
    { slug: 'smartwatches', name: 'Smart watchlar', nameRu: 'Смарт часы', icon: '⌚', color: '#06B6D4', imageUrl: '' },
];

async function addCategories() {
    for (const cat of categories) {
        try {
            const res = await fetch('http://localhost:3000/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cat),
            });
            const data = await res.json();
            if (res.ok) {
                console.log(`OK: ${cat.name}`);
            } else {
                console.log(`ERR ${cat.name}: ${JSON.stringify(data)}`);
            }
        } catch (e) {
            console.log(`FAIL ${cat.name}: ${e.message}`);
        }
    }
    
    // Check all categories
    const res = await fetch('http://localhost:3000/api/categories');
    const data = await res.json();
    console.log(`\nJami: ${data.categories.length} ta kategoriya`);
    data.categories.forEach(c => console.log(`  ${c.icon} ${c.name} (${c.slug})`));
}

addCategories();
