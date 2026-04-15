const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const data = [
  {
    title_uz: 'iPhone 15 Pro Max 256GB Black',
    price: 15500000,
    available: 1,
    weight: '221g',
    category_name: 'Smartfonlar'
  },
  {
    title_uz: 'MacBook Pro 14 M3 Chip',
    price: 22000000,
    available: 1,
    weight: '1.55kg',
    category_name: 'Noutbuklar'
  },
  {
    title_uz: 'Samsung Galaxy S24 Ultra',
    price: 14000000,
    available: 1,
    weight: '232g',
    category_name: 'Smartfonlar'
  },
  {
    title_uz: 'Sony WH-1000XM5 Headphones',
    price: 4500000,
    available: 0,
    weight: '250g',
    category_name: 'Audio'
  }
];

const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Mahsulotlar');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const filePath = path.join(publicDir, 'sample_products.xlsx');
XLSX.writeFile(workbook, filePath);

console.log('Sample Excel file created at:', filePath);
