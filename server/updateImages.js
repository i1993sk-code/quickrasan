import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const subCategorySchema = new mongoose.Schema({ name: String, image: String, category: Array }, { timestamps: true });
const productSchema = new mongoose.Schema({ name: String, image: Array, category: Array, subCategory: Array }, { timestamps: true });

const SubCategory = mongoose.model('subcategory', subCategorySchema);
const Product = mongoose.model('product', productSchema);

const CLOUD = 'https://res.cloudinary.com/dl20jzemu/image/upload';

async function updateImages() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Update subcategories
  const subs = await SubCategory.find();
  for (const sub of subs) {
    const url = `${CLOUD}/w_200,h_200,c_fill,b_rgb:1B5E20/l_text:Arial_20_bold:${encodeURIComponent(sub.name)},g_center,y_0,co_rgb:FFFFFF/v1/quickrasan/placeholder`;
    await SubCategory.findByIdAndUpdate(sub._id, { image: url });
    console.log(`  SubCategory: ${sub.name}`);
  }
  console.log(`Updated ${subs.length} subcategories`);

  // Update products
  const products = await Product.find();
  for (const p of products) {
    const url = `${CLOUD}/w_400,h_400,c_fill,b_rgb:1B5E20/l_text:Arial_25_bold:${encodeURIComponent(p.name.substring(0, 20))},g_center,y_0,co_rgb:FFFFFF/v1/quickrasan/placeholder`;
    await Product.findByIdAndUpdate(p._id, { image: [url] });
    console.log(`  Product: ${p.name}`);
  }
  console.log(`Updated ${products.length} products`);

  await mongoose.disconnect();
  console.log('Done!');
}

updateImages().catch(err => { console.error(err); process.exit(1); });
