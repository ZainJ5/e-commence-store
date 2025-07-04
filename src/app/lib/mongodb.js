import  mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log("Connected to Database");
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error connecting to Database:", error.message);
    } else {
      console.log("An unknown error occurred while connecting to the Database");
    }
  }
};

export default connectToDatabase;