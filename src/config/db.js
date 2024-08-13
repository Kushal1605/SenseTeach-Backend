import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // const connection = await mongoose.connect(`${process.env.MONGODB_URI}`);
    const connection = await mongoose.connect("mongodb://127.0.0.1/senseteach");
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
