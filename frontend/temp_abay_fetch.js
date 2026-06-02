const https = require('https');
const url = 'https://www.gov.kz/static/js/main.2d8e16c4.js';
https.get(url, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    const needle = 'fetch("/api/v2/_/c/"';
    const idx = body.indexOf(needle);
    console.log('idx', idx);
    if (idx !== -1) {
      console.log(body.slice(Math.max(0, idx - 500), idx + 1000));
    }
    const needle2 = 'fetch("/api/v1/public/_/c/"';
    const idx2 = body.indexOf(needle2);
    console.log('idx2', idx2);
    if (idx2 !== -1) {
      console.log(body.slice(Math.max(0, idx2 - 500), idx2 + 1000));
    }
    const k6 = body.indexOf('m={news:"k6"');
    console.log('k6', k6);
    if (k6 !== -1) console.log(body.slice(Math.max(0, k6 - 200), k6 + 400));
  });
}).on('error', (err) => console.error('ERR', err.message));
