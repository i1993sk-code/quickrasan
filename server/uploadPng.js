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

const subCategorySchema = new mongoose.Schema({ name: String, image: String }, { timestamps: true });
const SubCategory = mongoose.model('subcategory', subCategorySchema);
const productSchema = new mongoose.Schema({ name: String, image: Array }, { timestamps: true });
const Product = mongoose.model('product', productSchema);

async function uploadAsPng(name, w, h) {
  const url = `https://placehold.co/${w}x${h}/1B5E20/white?text=${encodeURIComponent(name)}`;
  const result = await cloudinary.uploader.upload(url, {
    folder: 'quickrasan/placeholders',
    public_id: name.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50),
    format: 'png',
  });
  return result.secure_url;
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected');

  const subs = await SubCategory.find();
  for (const s of subs) {
    const url = await uploadAsPng(s.name, 200, 200);
    await SubCategory.findByIdAndUpdate(s._id, { image: url });
    console.log(`  Sub: ${s.name}`);
  }
  console.log(`Done ${subs.length} subcategories`);

  const products = await Product.find();
  for (const p of products) {
    const url = await uploadAsPng(p.name.substring(0, 25), 400, 400);
    await Product.findByIdAndUpdate(p._id, { image: [url] });
    console.log(`  Prod: ${p.name.substring(0, 30)}`);
  }
  console.log(`Done ${products.length} products`);

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
