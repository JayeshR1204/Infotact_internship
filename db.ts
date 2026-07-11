import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        // Fallback to a local URI if an environment variable isn't set yet
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hrms';
        
        const conn = await mongoose.connect(mongoURI);
        
        console.log(`MongoDB Connected Safely: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${(error as Error).message}`);
        process.exit(1); // Stop the server if the database fails to connect
    }
};
export default connectDB;
