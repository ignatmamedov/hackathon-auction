import express from 'express';
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import bids from "./routes/bids.js";
import categories from './routes/categories.js';
import lots from "./routes/lots.js";
import {createErrorResponse} from "./utils/errorHandler.js";

dotenv.config();

const app = express();
const api = express.Router();

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

api.use('/auth', auth);
api.use('/categories', categories);
api.use('/bids', bids);
api.use('/lots', lots);
app.use('/api', api);

app.use((req, res) => {
  res.status(404).json(createErrorResponse(404, 'Not Found'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
