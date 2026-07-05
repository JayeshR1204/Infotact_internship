import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Change these to whatever you want your login details to be!
const ADMIN_EMAIL = "admin@enterprise.com";
const ADMIN_PASSWORD = "Password123!";

// 1. Define a basic inline User schema matching your system
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { collection: 'users' }); // Ensure it matches your database collection name

const User = mongoose.model('UserSeed', userSchema);

async function run() {
  try {
    // 2. Connect to your local MongoDB (Matches your server config)
    await mongoose.connect('mongodb://127.0.0.1:27017/hrms'); 
    console.log("🍃 Connected to MongoDB for seeding...");

    // 3. Clear existing conflicting seeds if any
    await User.deleteOne({ email: ADMIN_EMAIL });

    // 4. Securely encrypt the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // 5. Save the account
    await User.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });

    console.log("\n=========================================");
    console.log("🎉 MASTER ADMINISTRATIVE USER CREATED!");
    console.log(`📧 Corporate Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Passphrase:      ${ADMIN_PASSWORD}`);
    console.log("=========================================\n");

  } catch (err) {
    console.error("❌ Error creating admin:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
