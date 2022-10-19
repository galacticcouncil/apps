import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TALISMAN_ESM_MODULE = 'node_modules/@talismn/connect-wallets/dist/esm/index.js';
const talismanEsm = path.resolve(__dirname, TALISMAN_ESM_MODULE);

/**
 * Shake react import from talisman @talismn/connect-wallets
 *
 * 1. Read talisman esm and convert to array by line break
 * 2. Remove the the first element from talisman esm (react import) if any
 * 3. Convert array back to esm file
 * 4. Save updated esm file
 */
export function fixTalismanEsm() {
  let talismanEsmContent = fs.readFileSync(talismanEsm).toString().split('\n');
  if (talismanEsmContent[0].trim() == "import 'react';") {
    talismanEsmContent.shift();
    talismanEsmContent = talismanEsmContent.join('\n');
    fs.writeFileSync(talismanEsm, talismanEsmContent);
    console.log('React import removed from talisman');
  } else {
    console.log('Talisman already react free. No action needed.');
  }
}
