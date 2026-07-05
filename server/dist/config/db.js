import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        // Fallback to a local URI if an environment variable isn't set yet
        const mongoURI = process.env.MONGO_URI || 'mongodb://hrms_user:HRMS_Secret_Password_2026@127.0.0.1:27017/hrms?authSource=hrms';
        const conn = await mongoose.connect(mongoURI);
        console.log(`🍃 MongoDB Connected Safely: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        process.exit(1); // Stop the server if the database fails to connect
    }
};
export default connectDB;
