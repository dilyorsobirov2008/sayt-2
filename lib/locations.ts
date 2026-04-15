export interface District {
    id: string;
    name: string;
    nameRu: string;
}

export interface Region {
    id: string;
    name: string;
    nameRu: string;
    districts: District[];
}

export const regions: Region[] = [
    {
        id: 'tashkent-city',
        name: 'Toshkent shahri',
        nameRu: 'г. Ташкент',
        districts: [
            { id: 'yunusabad', name: 'Yunusobod tumani', nameRu: 'Юнусабадский р-н' },
            { id: 'chilanzar', name: 'Chilonzor tumani', nameRu: 'Чиланзарский р-н' },
            { id: 'mirzo-ulugbek', name: 'Mirzo Ulugbek tumani', nameRu: 'Мирзо-Улугбекский р-н' },
            { id: 'yashnabad', name: 'Yashnobod tumani', nameRu: 'Яшнабадский р-н' },
            { id: 'mirabad', name: 'Mirobod tumani', nameRu: 'Мирабадский р-н' },
            { id: 'shaikhantahur', name: 'Shayxontohur tumani', nameRu: 'Шайхантахурский р-н' },
            { id: 'almazar', name: 'Olmazor tumani', nameRu: 'Алмазарский р-н' },
            { id: 'sergeli', name: 'Sirgʻali tumani', nameRu: 'Сергелийский р-н' },
            { id: 'bektemir', name: 'Bektemir tumani', nameRu: 'Бектемирский р-н' },
            { id: 'uchtepa', name: 'Uchtepa tumani', nameRu: 'Учтепинский р-н' },
            { id: 'yakka-saray', name: 'Yakkasaroy tumani', nameRu: 'Яккасарайский р-н' },
        ]
    },
    {
        id: 'tashkent-region',
        name: 'Toshkent viloyati',
        nameRu: 'Ташкентская область',
        districts: [
            { id: 'chirchiq', name: 'Chirchiq shahri', nameRu: 'г. Чирчик' },
            { id: 'nurafshon', name: 'Nurafshon shahri', nameRu: 'г. Нурафшон' },
            { id: 'yangiyul', name: 'Yangiyoʻl shahri', nameRu: 'г. Янгиюль' },
            { id: 'angren', name: 'Angren shahri', nameRu: 'г. Ангрен' },
            { id: 'olmaliq', name: 'Olmaliq shahri', nameRu: 'г. Алмалык' },
        ]
    },
    {
        id: 'samarkand',
        name: 'Samarqand viloyati',
        nameRu: 'Самаркандская область',
        districts: [
            { id: 'samarkand-city', name: 'Samarqand shahri', nameRu: 'г. Самарканд' },
            { id: 'pastdargom', name: 'Pastdargʻom tumani', nameRu: 'Пастдаргомский р-н' },
            { id: 'bulungur', name: 'Bulungʻur tumani', nameRu: 'Булунгурский р-н' },
        ]
    },
    {
        id: 'fergana',
        name: 'Fargʻona viloyati',
        nameRu: 'Ферганская область',
        districts: [
            { id: 'fergana-city', name: 'Fargʻona shahri', nameRu: 'г. Фергана' },
            { id: 'margilan', name: 'Margʻilon shahri', nameRu: 'г. Маргилан' },
            { id: 'kokand', name: 'Qoʻqon shahri', nameRu: 'г. Коканд' },
        ]
    },
    {
        id: 'andijan',
        name: 'Andijon viloyati',
        nameRu: 'Андижанская область',
        districts: [
            { id: 'andijan-city', name: 'Andijon shahri', nameRu: 'г. Андижан' },
            { id: 'asaka', name: 'Asaka shahri', nameRu: 'г. Асака' },
        ]
    },
    {
        id: 'namangan',
        name: 'Namangan viloyati',
        nameRu: 'Наманганская область',
        districts: [
            { id: 'namangan-city', name: 'Namangan shahri', nameRu: 'г. Наманган' },
            { id: 'chortoq', name: 'Chortoq shahri', nameRu: 'г. Чартак' },
        ]
    },
    {
        id: 'bukhara',
        name: 'Buxoro viloyati',
        nameRu: 'Бухарская область',
        districts: [
            { id: 'bukhara-city', name: 'Buxoro shahri', nameRu: 'г. Бухара' },
            { id: 'gijduvan', name: 'Gʻijduvon tumani', nameRu: 'Гиждуванский р-н' },
        ]
    },
    {
        id: 'navoi',
        name: 'Navoiy viloyati',
        nameRu: 'Навоийская область',
        districts: [
            { id: 'navoi-city', name: 'Navoiy shahri', nameRu: 'г. Навои' },
            { id: 'zarafshan', name: 'Zarafshon shahri', nameRu: 'г. Зарафшан' },
        ]
    },
    {
        id: 'kashkadarya',
        name: 'Qashqadaryo viloyati',
        nameRu: 'Кашкадарьинская область',
        districts: [
            { id: 'karshi', name: 'Qarshi shahri', nameRu: 'г. Карши' },
            { id: 'shaxrisabz', name: 'Shahrisabz shahri', nameRu: 'г. Шахрисабз' },
        ]
    },
    {
        id: 'surkhandarya',
        name: 'Surxondaryo viloyati',
        nameRu: 'Сурхандарьинская область',
        districts: [
            { id: 'termiz', name: 'Termiz shahri', nameRu: 'г. Термез' },
            { id: 'denov', name: 'Denov tumani', nameRu: 'Денауский р-н' },
        ]
    },
    {
        id: 'khorezm',
        name: 'Xorazm viloyati',
        nameRu: 'Хорезмская область',
        districts: [
            { id: 'urgench', name: 'Urganch shahri', nameRu: 'г. Ургенч' },
            { id: 'khiva', name: 'Xiva shahri', nameRu: 'г. Хива' },
        ]
    },
    {
        id: 'jizzakh',
        name: 'Jizzax viloyati',
        nameRu: 'Джизакская область',
        districts: [
            { id: 'jizzakh-city', name: 'Jizzax shahri', nameRu: 'г. Джизак' },
        ]
    },
    {
        id: 'sirdarya',
        name: 'Sirdaryo viloyati',
        nameRu: 'Сырдарьинская область',
        districts: [
            { id: 'gulistan', name: 'Guliston shahri', nameRu: 'г. Гулистан' },
            { id: 'yangiyer', name: 'Yangiyer shahri', nameRu: 'г. Янгиер' },
        ]
    },
    {
        id: 'karakalpakstan',
        name: 'Qoraqalpogʻiston Respublikasi',
        nameRu: 'Республика Каракалпакстан',
        districts: [
            { id: 'nukus', name: 'Nukus shahri', nameRu: 'г. Нукус' },
            { id: 'kungrad', name: 'Qoʻngʻirot tumani', nameRu: 'Кунградский р-н' },
        ]
    }
];
