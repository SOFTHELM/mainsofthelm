const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

const bucket = process.env.S3_BUCKET;
let s3;

if (process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY && bucket) {
  s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION
  });
}

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

async function uploadFile({ buffer, filename, mimetype }) {
  if (s3) {
    const key = `${Date.now()}-${filename}`;
    const params = { Bucket: bucket, Key: key, Body: buffer, ContentType: mimetype, ACL: 'public-read' };
    const res = await s3.upload(params).promise();
    return res.Location;
  } else {
    const localPath = path.join(uploadsDir, `${Date.now()}-${filename}`);
    fs.writeFileSync(localPath, buffer);
    const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    return `${base}/uploads/${path.basename(localPath)}`;
  }
}

module.exports = { uploadFile };
