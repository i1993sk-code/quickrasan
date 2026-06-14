import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const subCategorySchema = new mongoose.Schema({ name: String, image: String, category: Array }, { timestamps: true });
const SubCategory = mongoose.model('subcategory', subCategorySchema);

async function fixImages() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const subs = await SubCategory.find();
  for (const sub of subs) {
    // Replace .svg with f_auto,f_png for browser-safe PNG delivery
    const newUrl = sub.image.replace('/upload/', '/upload/f_auto,f_png/');
    await SubCategory.findByIdAndUpdate(sub._id, { image: newUrl });
    console.log(`  ${sub.name}: fixed`);
  }
  console.log(`Fixed ${subs.length} subcategory images`);

  // Fix products too
  const productSchema = new mongoose.Schema({ name: String, image: Array }, { timestamps: true });
  const Product = mongoose.model('product', productSchema);
  const products = await Product.find();
  let count = 0;
  for (const p of products) {
    if (p.image && p.image[0] && p.image[0].includes('placehold.co')) {
      const newUrl = p.image[0].replace('/upload/', '/upload/f_auto,f_png/');
      await Product.findByIdAndUpdate(p._id, { image: [newUrl] });
      count++;
    } else if (p.image && p.image[0]) {
      // Already cloudinary but might need f_auto
      await Product.findByIdAndUpdate(p._id, { image: [p.image[0].replace('.svg', '')] });
      count++;
    }
  }
  console.log(`Fixed ${count} product images`);

  await mongoose.disconnect();
  console.log('Done!');
}

fixImages().catch(err => { console.error(err); process.exit(1); });
