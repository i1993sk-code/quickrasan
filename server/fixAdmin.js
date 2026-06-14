import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const User = mongoose.model('user', new mongoose.Schema({}, { strict: false }));

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await User.updateOne({ email: 'admin@quickrasan.com' }, { $set: { verify_email: true, status: 'Active' } });
  console.log('Admin updated — verify_email set to true');
  await mongoose.disconnect();
}).catch(console.error);
