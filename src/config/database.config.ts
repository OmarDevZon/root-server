import mongoose from "mongoose";
import config from ".";

export async function databaseConnecting() {
    try {
      if (config.MONGO_PROD as object | undefined) {
        await mongoose.connect(config.MONGO_URI_PROD as string);
        console.log('🚀 Connected to database for Production');
      } else {
        await mongoose.connect(config.MONGO_URI_DEV as string);
        console.log('🚀 Connected to database for Development');
      }
    } catch (error) {
      console.error('Error connecting to the database');
    }
  }