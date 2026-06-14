import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const userSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: { type: String, default: 'USER' }
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const existing = await User.findOne({ email: 'admin@quickrasan.com' });
  if (existing) {
    console.log('Admin already exists');
    await mongoose.disconnect();
    return;
  }
  const salt = await bcryptjs.genSalt(10);
  const hashed = await bcryptjs.hash('admin@2024', salt);
  await User.create({ name: 'Admin', email: 'admin@quickrasan.com', password: hashed, role: 'ADMIN' });
  console.log('Admin created: admin@quickrasan.com / admin@2024');
  await mongoose.disconnect();
}

createAdmin().catch(console.error);
