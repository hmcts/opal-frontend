import * as fs from 'fs';
//import * as path from 'path';
import { glob } from 'glob';

/*
To execute this script, run:
npx ts-node scripts/extract-pot-keys-from-tests.ts

This will create a file named matches.csv in the current directory with the extracted keys.
*/

// === CONFIG ===
const filePatterns = ['**/*.cy.ts', '**/*.feature']; // change this
const regex = /@JIRA-KEY:POT-[0-9]{4}/g;

// ==============

type Row = {
  match: string;
};

async function run() {
  const files = await glob(filePatterns, { nodir: true });

  const rows: Row[] = [];

  for (const file of files) {
    let content: string;

    try {
      content = fs.readFileSync(file, 'utf-8');
    } catch {
      continue;
    }

    let match;
    while ((match = regex.exec(content)) !== null) {
      rows.push({
        match: match[0],
      });
    }
  }

  const csvRows = rows.map((row) => {
    let escapedMatch = row.match.replace(/"/g, '"\\"');
    escapedMatch = escapedMatch.replace(/@JIRA-KEY:/g, ''); // Escape commas if needed
    return `"${escapedMatch}"`;
  });

  fs.writeFileSync('matches.csv', csvRows.join(','));

  console.log(`Wrote ${rows.length} matches to matches.csv`);
}

run();
