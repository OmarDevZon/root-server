import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  PORT: process.env.PORT,
  MONGO_URI_DEV: process.env.MONGO_URI_DEV,
  MONGO_URI_PROD: process.env.MONGO_URI_PROD,
  MONGO_PROD: process.env.MONGO_PROD,
  WELCOME_MESSAGE: process.env.WELCOME_MESSAGE,
};
