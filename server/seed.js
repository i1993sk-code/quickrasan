import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const categorySchema = new mongoose.Schema({ name: String, image: String }, { timestamps: true });
const subCategorySchema = new mongoose.Schema({ name: String, image: String, category: [{ type: mongoose.Schema.ObjectId, ref: 'category' }] }, { timestamps: true });
const productSchema = new mongoose.Schema({
  name: String, image: Array, category: [{ type: mongoose.Schema.ObjectId, ref: 'category' }],
  subCategory: [{ type: mongoose.Schema.ObjectId, ref: 'subcategory' }],
  unit: String, stock: Number, price: Number, discount: Number,
  description: String, more_details: Object, publish: Boolean,
}, { timestamps: true });

const Category = mongoose.model('category', categorySchema);
const SubCategory = mongoose.model('subcategory', subCategorySchema);
const Product = mongoose.model('product', productSchema);

const categories = [
  { name: 'Dairy, Bread & Eggs', file: 'Dairy, Bread & Eggs.webp' },
  { name: 'Atta, Rice & Dal', file: 'Atta, Rice & Dal.webp' },
  { name: 'Masala, Oil & More', file: 'Masala, Oil & More.png' },
  { name: 'Bakery & Biscuits', file: 'Bakery & Biscuits.jpg' },
  { name: 'Tea, Coffee & Health Drinks', file: 'Tea, Coffee & Health Drinks.webp' },
  { name: 'Cold Drinks & Juices', file: 'Cold Drinks & Juices.png' },
  { name: 'Beauty & Cosmetics', file: 'Beauty & Cosmetics.webp' },
  { name: 'Personal Care', file: 'Personal Care.jpg' },
  { name: 'Cleaning Essentials', file: 'Cleaning Essentials.jpg' },
  { name: 'Baby Care', file: 'Baby Care.jpg' },
  { name: 'Breakfast & Instant Food', file: 'Breakfast & Instant Food.webp' },
  { name: 'Sauces & Spreads', file: 'Sauces & Spreads.webp' },
  { name: 'Chips & Namkeens', file: 'chips and namkeens.webp' },
  { name: 'Munchies', file: 'Munchies.webp' },
  { name: 'Organic & Gourmet', file: 'Organic & Gourmet.jpg' },
  { name: 'Birthday', file: 'birthday.webp' },
];

const assetsDir = 'C:\\Users\\HP i5\\Desktop\\QuickRasan_Assets\\category';

async function uploadImage(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder: 'quickrasan/categories' });
    return result.secure_url;
  } catch (err) {
    console.error(`Upload failed for ${filePath}:`, err.message);
    return `https://placehold.co/200x200/0c831f/white?text=${encodeURIComponent(path.basename(filePath, path.extname(filePath)))}`;
  }
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const existingCategories = await Category.countDocuments();
  if (existingCategories > 0) {
    console.log(`Already have ${existingCategories} categories, skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  console.log('Uploading images to Cloudinary...');
  const categoryDocs = [];
  for (const cat of categories) {
    const filePath = path.join(assetsDir, cat.file);
    if (fs.existsSync(filePath)) {
      const imageUrl = await uploadImage(filePath);
      const created = await Category.create({ name: cat.name, image: imageUrl });
      categoryDocs.push(created);
      console.log(`  Created category: ${cat.name}`);
    } else {
      console.log(`  File not found: ${filePath}, creating with placeholder`);
      const created = await Category.create({
        name: cat.name,
        image: `https://placehold.co/200x200/0c831f/white?text=${encodeURIComponent(cat.name)}`
      });
      categoryDocs.push(created);
    }
  }

  const subCategories = [
    { name: 'Milk', category: ['Dairy, Bread & Eggs'] },
    { name: 'Bread', category: ['Dairy, Bread & Eggs', 'Bakery & Biscuits'] },
    { name: 'Butter & Cheese', category: ['Dairy, Bread & Eggs'] },
    { name: 'Eggs', category: ['Dairy, Bread & Eggs'] },
    { name: 'Rice', category: ['Atta, Rice & Dal'] },
    { name: 'Wheat Flour (Atta)', category: ['Atta, Rice & Dal'] },
    { name: 'Dal (Pulses)', category: ['Atta, Rice & Dal'] },
    { name: 'Cooking Oil', category: ['Masala, Oil & More'] },
    { name: 'Ghee', category: ['Masala, Oil & More', 'Dairy, Bread & Eggs'] },
    { name: 'Spices (Masala)', category: ['Masala, Oil & More'] },
    { name: 'Biscuits & Cookies', category: ['Bakery & Biscuits'] },
    { name: 'Cakes & Pastries', category: ['Bakery & Biscuits', 'Birthday'] },
    { name: 'Tea', category: ['Tea, Coffee & Health Drinks'] },
    { name: 'Coffee', category: ['Tea, Coffee & Health Drinks'] },
    { name: 'Health Drinks', category: ['Tea, Coffee & Health Drinks'] },
    { name: 'Soft Drinks', category: ['Cold Drinks & Juices'] },
    { name: 'Juices', category: ['Cold Drinks & Juices'] },
    { name: 'Skincare', category: ['Beauty & Cosmetics', 'Personal Care'] },
    { name: 'Hair Care', category: ['Beauty & Cosmetics', 'Personal Care'] },
    { name: 'Soaps & Body Wash', category: ['Personal Care'] },
    { name: 'Oral Care', category: ['Personal Care'] },
    { name: 'Detergent & Dishwash', category: ['Cleaning Essentials'] },
    { name: 'Floor Cleaners', category: ['Cleaning Essentials'] },
    { name: 'Diapers & Wipes', category: ['Baby Care'] },
    { name: 'Baby Food', category: ['Baby Care'] },
    { name: 'Cereal & Oats', category: ['Breakfast & Instant Food'] },
    { name: 'Noodles & Pasta', category: ['Breakfast & Instant Food'] },
    { name: 'Ketchup & Sauces', category: ['Sauces & Spreads'] },
    { name: 'Jam & Spreads', category: ['Sauces & Spreads', 'Bakery & Biscuits'] },
    { name: 'Chips', category: ['Chips & Namkeens', 'Munchies'] },
    { name: 'Namkeens', category: ['Chips & Namkeens', 'Munchies'] },
    { name: 'Dry Fruits', category: ['Organic & Gourmet', 'Munchies'] },
    { name: 'Organic Staples', category: ['Organic & Gourmet', 'Atta, Rice & Dal'] },
  ];

  const subDocMap = {};
  for (const sub of subCategories) {
    const catIds = sub.category.map(cName => categoryDocs.find(c => c.name === cName)?._id).filter(Boolean);
    if (catIds.length > 0) {
      const created = await SubCategory.create({
        name: sub.name,
        image: `https://placehold.co/200x200/0c831f/white?text=${encodeURIComponent(sub.name)}`,
        category: catIds,
      });
      subDocMap[sub.name] = created;
    }
  }
  console.log(`Created ${Object.keys(subDocMap).length} subcategories`);

  const products = [
    { name: 'Amul Taaza Toned Milk 1L', subCategory: 'Milk', unit: '1 L', price: 68, discount: 0, stock: 200, description: 'Fresh toned milk, pasteurized & packed.' },
    { name: 'Amul Gold Full Cream Milk 1L', subCategory: 'Milk', unit: '1 L', price: 78, discount: 5, stock: 150, description: 'Rich full cream milk.' },
    { name: 'Nestle A+ Milk 500ml', subCategory: 'Milk', unit: '500 ml', price: 38, discount: 0, stock: 180, description: 'Pure & fresh milk.' },
    { name: 'Modern Bread White 400g', subCategory: 'Bread', unit: '400 g', price: 35, discount: 0, stock: 100, description: 'Soft white bread.' },
    { name: 'Britannia Brown Bread 400g', subCategory: 'Bread', unit: '400 g', price: 45, discount: 10, stock: 80, description: 'Healthy brown bread.' },
    { name: 'Amul Butter 100g', subCategory: 'Butter & Cheese', unit: '100 g', price: 58, discount: 0, stock: 120, description: 'Salted butter.' },
    { name: 'Amul Cheese Slices 10pcs', subCategory: 'Butter & Cheese', unit: '200 g', price: 95, discount: 8, stock: 60, description: 'Cheese slices perfect for sandwiches.' },
    { name: 'Eggs (6 pcs)', subCategory: 'Eggs', unit: '6 pcs', price: 36, discount: 0, stock: 500, description: 'Farm fresh eggs.' },
    { name: 'Eggs (12 pcs) Tray', subCategory: 'Eggs', unit: '12 pcs', price: 68, discount: 5, stock: 300, description: 'Farm fresh eggs tray pack.' },
    { name: 'India Gate Basmati Rice 1kg', subCategory: 'Rice', unit: '1 kg', price: 145, discount: 0, stock: 50, description: 'Premium basmati rice.' },
    { name: 'Fortune Chana Dal 500g', subCategory: 'Dal (Pulses)', unit: '500 g', price: 82, discount: 0, stock: 70, description: 'Premium chana dal.' },
    { name: 'Toor Dal 1kg', subCategory: 'Dal (Pulses)', unit: '1 kg', price: 155, discount: 12, stock: 45, description: 'Pure toor dal.' },
    { name: 'Aashirvaad Whole Wheat Atta 5kg', subCategory: 'Wheat Flour (Atta)', unit: '5 kg', price: 335, discount: 18, stock: 40, description: 'Whole wheat atta.' },
    { name: 'Fortune Refined Oil 1L', subCategory: 'Cooking Oil', unit: '1 L', price: 185, discount: 0, stock: 35, description: 'Refined cooking oil.' },
    { name: 'Patanjali Ghee 500ml', subCategory: 'Ghee', unit: '500 ml', price: 285, discount: 0, stock: 25, description: 'Pure cow ghee.' },
    { name: 'MDH Garam Masala 100g', subCategory: 'Spices (Masala)', unit: '100 g', price: 55, discount: 0, stock: 100, description: 'Premium garam masala.' },
    { name: 'Parle G Biscuit 100g', subCategory: 'Biscuits & Cookies', unit: '100 g', price: 12, discount: 0, stock: 500, description: 'India\'s favourite biscuit.' },
    { name: 'Hide & Seek Biscuit 150g', subCategory: 'Biscuits & Cookies', unit: '150 g', price: 35, discount: 0, stock: 200, description: 'Chocolate filled biscuit.' },
    { name: 'Taj Mahal Chai Patti 250g', subCategory: 'Tea', unit: '250 g', price: 195, discount: 0, stock: 80, description: 'Premium tea leaves.' },
    { name: 'Nestle Classic Coffee 100g', subCategory: 'Coffee', unit: '100 g', price: 265, discount: 15, stock: 40, description: 'Instant coffee granules.' },
    { name: 'Coca-Cola 750ml', subCategory: 'Soft Drinks', unit: '750 ml', price: 40, discount: 0, stock: 100, description: 'Chilled Coca-Cola.' },
    { name: 'Real Mixed Fruit Juice 1L', subCategory: 'Juices', unit: '1 L', price: 125, discount: 0, stock: 60, description: 'Mixed fruit juice.' },
    { name: 'Ponds Face Wash 100g', subCategory: 'Skincare', unit: '100 g', price: 155, discount: 20, stock: 30, description: 'Pimple clearing face wash.' },
    { name: 'Dove Shampoo 180ml', subCategory: 'Hair Care', unit: '180 ml', price: 165, discount: 0, stock: 45, description: 'Hair fall rescue shampoo.' },
    { name: 'Lux Soap Bar 100g', subCategory: 'Soaps & Body Wash', unit: '100 g', price: 38, discount: 0, stock: 150, description: 'Soft touch soap.' },
    { name: 'Colgate Toothpaste 150g', subCategory: 'Oral Care', unit: '150 g', price: 95, discount: 10, stock: 100, description: 'Advanced fresh toothpaste.' },
    { name: 'Surf Excel Detergent 1kg', subCategory: 'Detergent & Dishwash', unit: '1 kg', price: 155, discount: 5, stock: 40, description: 'Easy wash detergent powder.' },
    { name: 'Harpic Toilet Cleaner 500ml', subCategory: 'Floor Cleaners', unit: '500 ml', price: 85, discount: 0, stock: 35, description: 'Original power plus toilet cleaner.' },
    { name: 'Huggies Diapers Midi 28pk', subCategory: 'Diapers & Wipes', unit: '28 pcs', price: 425, discount: 25, stock: 20, description: 'Soft & absorbent diapers.' },
    { name: 'Nestle Cerelac Wheat 300g', subCategory: 'Baby Food', unit: '300 g', price: 185, discount: 0, stock: 25, description: 'Baby cereal.' },
    { name: 'Kellogg\'s Corn Flakes 250g', subCategory: 'Cereal & Oats', unit: '250 g', price: 125, discount: 0, stock: 40, description: 'Breakfast cereal.' },
    { name: 'Maggi Noodles 2-Min 70g x 6', subCategory: 'Noodles & Pasta', unit: '420 g (6 pack)', price: 72, discount: 0, stock: 200, description: '2-minute instant noodles.' },
    { name: 'Kissan Ketchup 500g', subCategory: 'Ketchup & Sauces', unit: '500 g', price: 85, discount: 0, stock: 80, description: 'Tomato ketchup.' },
    { name: 'Kissan Mixed Fruit Jam 500g', subCategory: 'Jam & Spreads', unit: '500 g', price: 95, discount: 0, stock: 60, description: 'Mixed fruit jam.' },
    { name: 'Lays Chips Classic 52g', subCategory: 'Chips', unit: '52 g', price: 20, discount: 0, stock: 500, description: 'Simply salted chips.' },
    { name: 'Haldiram\'s Aloo Bhujia 200g', subCategory: 'Namkeens', unit: '200 g', price: 55, discount: 0, stock: 100, description: 'Crispy aloo bhujia.' },
    { name: 'Badam (Almonds) 250g', subCategory: 'Dry Fruits', unit: '250 g', price: 375, discount: 0, stock: 30, description: 'California almonds.' },
    { name: 'Pista (Pistachios) 200g', subCategory: 'Dry Fruits', unit: '200 g', price: 420, discount: 10, stock: 20, description: 'Premium pistachios.' },
  ];

  let productCount = 0;
  for (const p of products) {
    const subDoc = subDocMap[p.subCategory];
    if (!subDoc) { console.log(`  SubCategory not found: ${p.subCategory}, skipping`); continue; }
    const catIds = subDoc.category;
    const made = await Product.create({
      name: p.name, unit: p.unit, price: p.price, discount: p.discount, stock: p.stock,
      description: p.description, publish: true,
      image: [`https://placehold.co/400x400/0c831f/white?text=${encodeURIComponent(p.name.substring(0, 20))}`],
      category: catIds, subCategory: [subDoc._id],
      more_details: {},
    });
    productCount++;
    if (productCount % 10 === 0) console.log(`  Created ${productCount} products...`);
  }
  console.log(`Created ${productCount} products total.`);
  await mongoose.disconnect();
  console.log('Seed completed!');
}

seed().catch(err => { console.error(err); process.exit(1); });
