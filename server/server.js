import app from './app.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables at the entry point
dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log('OpenAI Key exists:', !!process.env.OPENAI_API_KEY);

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});