const env = process.env;
console.log('--- PATH entries containing "mongo" ---');
(env.PATH||'').split(';').filter(p=>/mongo/i.test(p)).forEach(p=>console.log(p));
console.log('\n--- Environment variables with "MONGO" or containing "Mongo" ---');
Object.keys(env).filter(k=>/MONGO/i.test(k) || /mongo/i.test(env[k])).forEach(k=>console.log(k+"="+env[k]));
console.log('\n--- where mongod (if any) ---');
try { const { execSync } = require('child_process');
  const out = execSync('where mongod', { encoding: 'utf8' });
  console.log(out);
} catch (e) {
  console.log('<where mongod not found>');
}
console.log('\n--- Done ---');
