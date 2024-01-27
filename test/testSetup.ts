import { generateData } from './integration/populate_db';

async function setup() {
  await generateData();
  console.log('Test database has been populated.');
}

setup();
