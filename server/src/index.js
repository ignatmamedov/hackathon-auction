import express from 'express';
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import bids from "./routes/bids.js";
import categories from './routes/categories.js';
import lots from "./routes/lots.js";
import {createErrorResponse} from "./utils/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf);
    } catch (error) {
      const errorResponse = createErrorResponse(400, 'Invalid JSON format');
      res.status(errorResponse.error.code).json(errorResponse);
    }
  }
}));

app.use('/auth', auth);
app.use('/categories', categories);
app.use('/bids', bids);
app.use('/lots', lots);

app.use((req, res) => {
  res.status(404).json(createErrorResponse(404, 'Not Found'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
