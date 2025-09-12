const crypto = require('crypto');

function generateMD5Password(username, password) {
  const combined = password + username;
  const hash = crypto.createHash('md5').update(combined).digest('hex');
  return 'md5' + hash;
}

// Usage: node generate_password.js username password
const username = process.argv[2] || 'postgres';
const password = process.argv[3] || 'your_password';

const md5Hash = generateMD5Password(username, password);
console.log(`"${username}" "${md5Hash}"`);
console.log('\nAdd this line to your userlist.txt file');
