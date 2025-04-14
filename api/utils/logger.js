import { fileURLToPath } from 'url';
import morgan from "morgan";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' });
export const logger = morgan('combined', { stream: accessLogStream });
