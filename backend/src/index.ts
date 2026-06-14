import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_ENV = [
  'STELLAR_NETWORK',
  'SOROBAN_RPC_URL',
  'NETWORK_PASSPHRASE',
  'ESCROW_CONTRACT_ID',
  'ORACLE_SECRET_KEY'
];

const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnv.join(', ')}`);
  console.error("Please configure them in your .env file.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', service: 'EpochSend Oracle Backend' });
});

// Basic Webhook Trigger Ingestion Route (Placeholder for Issue #7)
app.post('/api/webhooks/trigger', (req: Request, res: Response) => {
  // TODO: Validate payload with Zod
  // TODO: Authenticate API Key
  // TODO: Execute Stellar Transaction
  const { escrowId, triggerSecret } = req.body;
  
  console.log(`Received webhook trigger for Escrow ID: ${escrowId}`);
  
  res.status(202).json({
    status: 'Accepted',
    message: 'Webhook received. Execution pending.',
    escrowId
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EpochSend Oracle Backend is running on port ${PORT}`);
  console.log(`⚙️ Connected to Soroban Network: ${process.env.STELLAR_NETWORK || 'TESTNET'}`);
});
