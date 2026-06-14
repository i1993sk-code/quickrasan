import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const subCategorySchema = new mongoose.Schema({ name: String, image: String }, { timestamps: true });
const SubCategory = mongoose.model('subcategory', subCategorySchema);
const productSchema = new mongoose.Schema({ name: String, image: Array }, { timestamps: true });
const Product = mongoose.model('product', productSchema);

function cloudUrl(width, height, text) {
  const src = `https://placehold.co/${width}x${height}/1B5E20/white?text=${encodeURIComponent(text)}`;
  return `https://res.cloudinary.com/dl20jzemu/image/fetch/f_auto,q_auto,w_${width},h_${height},c_fill/${encodeURIComponent(src)}`;
}

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected');

  const subs = await SubCategory.find();
  for (const s of subs) {
    await SubCategory.findByIdAndUpdate(s._id, { image: cloudUrl(200, 200, s.name) });
    console.log(`  Sub: ${s.name}`);
  }
  console.log(`Fixed ${subs.length} subcategories`);

  const products = await Product.find();
  for (const p of products) {
    await Product.findByIdAndUpdate(p._id, { image: [cloudUrl(400, 400, p.name.substring(0, 25))] });
    console.log(`  Prod: ${p.name.substring(0, 30)}`);
  }
  console.log(`Fixed ${products.length} products`);

  await mongoose.disconnect();
  console.log('Done');
}

fix().catch(err => { console.error(err); process.exit(1); });
