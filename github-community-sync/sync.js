import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This script reads all JSON files in this directory and POSTs them to the Payload CMS API.
// It is designed to be run by a GitHub Action whenever a PR is merged into the main branch.

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'https://my-app.lama-4db.workers.dev/api/listings';
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY; // You should set up an API key in Payload for secure server-to-server auth

async function syncSubmissions() {
  console.log('Starting FMHY Community Sync...');
  
  if (!PAYLOAD_API_KEY) {
    console.warn('⚠️ WARNING: PAYLOAD_API_KEY is not set. The sync might fail if the collection requires authentication.');
  }

  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.json') && f !== 'package.json');
  console.log(`Found ${files.length} submissions to process.`);

  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    try {
      const filePath = path.join(__dirname, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);

      console.log(`Processing: ${file}...`);
      
      const response = await fetch(PAYLOAD_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(PAYLOAD_API_KEY && { 'Authorization': `users API-Key ${PAYLOAD_API_KEY}` })
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log(`✅ Successfully synced ${file}`);
        successCount++;
        // Optional: Move the file to a "processed" folder or delete it so it isn't synced twice
      } else {
        const errorText = await response.text();
        console.error(`❌ Failed to sync ${file}: ${response.status} ${response.statusText}`, errorText);
        failCount++;
      }
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err.message);
      failCount++;
    }
  }

  console.log('--- Sync Complete ---');
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

syncSubmissions();
