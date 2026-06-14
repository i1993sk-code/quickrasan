import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const subCategorySchema = new mongoose.Schema({ name: String, image: String, category: Array }, { timestamps: true });
const productSchema = new mongoose.Schema({ name: String, image: Array, category: Array, subCategory: Array }, { timestamps: true });

const SubCategory = mongoose.model('subcategory', subCategorySchema);
const Product = mongoose.model('product', productSchema);

async function uploadPlaceholder(name, w, h) {
  const url = `https://placehold.co/${w}x${h}/1B5E20/white?text=${encodeURIComponent(name)}`;
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: 'quickrasan/placeholders',
      public_id: name.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50),
    });
    return result.secure_url;
  } catch (err) {
    console.error(`  Upload failed for ${name}:`, err.message);
    return url; // fallback to placehold.co
  }
}

async function updateImages() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Update subcategories
  const subs = await SubCategory.find();
  for (const sub of subs) {
    const url = await uploadPlaceholder(sub.name, 200, 200);
    await SubCategory.findByIdAndUpdate(sub._id, { image: url });
    console.log(`  SubCategory: ${sub.name} -> ${url.substring(0, 60)}...`);
  }
  console.log(`Updated ${subs.length} subcategories`);

  // Update products
  const products = await Product.find();
  for (const p of products) {
    const url = await uploadPlaceholder(p.name.substring(0, 25), 400, 400);
    await Product.findByIdAndUpdate(p._id, { image: [url] });
    console.log(`  Product: ${p.name} -> ${url.substring(0, 60)}...`);
  }
  console.log(`Updated ${products.length} products`);

  await mongoose.disconnect();
  console.log('Done!');
}

updateImages().catch(err => { console.error(err); process.exit(1); });
