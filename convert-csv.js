const fs = require('fs');

const lines = fs.readFileSync('c:\\Users\\momen\\Documents\\1.SmallCar\\Cars_db.csv', 'utf-8').split('\n');
const db = {};

for (const line of lines) {
  if (!line.trim()) continue;
  const parts = line.split(';');
  if (parts.length >= 2) {
    const make = parts[0].trim().toLowerCase();
    const model = parts[1].trim();
    
    if (!db[make]) {
      db[make] = new Set();
    }
    db[make].add(model);
  }
}

// Convert Sets to Arrays
const result = {};
for (const make in db) {
  result[make] = Array.from(db[make]).sort();
}

fs.writeFileSync(
  'c:\\Users\\momen\\Documents\\1.SmallCar\\smallcar-site\\src\\sanity\\data\\offlineModels.json', 
  JSON.stringify(result, null, 2)
);
console.log('Successfully generated offlineModels.json');
