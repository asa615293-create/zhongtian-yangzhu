const fs = require('fs');
const path = require('path');

const roomIdToName = {
  entrance: '玄关',
  living: '客餐厅',
  kitchen: '厨房',
  masterBedroom: '主卧',
  secondBedroom: '次卧',
  study: '书房',
  bathroom1: '主卫',
  bathroom2: '次卫',
  bathroom3: '公卫',
  balcony: '阳台'
};

const projectRoot = path.resolve(__dirname, '..');
const baseDir = path.join(projectRoot, '现场实拍图');
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

// Find latest backup
const backupsDir = path.join(projectRoot, 'backups');
const backupFiles = fs.readdirSync(backupsDir)
  .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
  .sort()
  .reverse();
const latestBackup = backupFiles[0];
if (!latestBackup) {
  console.error('No backup file found');
  process.exit(1);
}

console.log('Using backup:', latestBackup);
const data = JSON.parse(fs.readFileSync(path.join(backupsDir, latestBackup), 'utf-8'));
const photos = data.photos || {};

let totalSaved = 0;

Object.keys(photos).forEach(roomId => {
  const roomName = roomIdToName[roomId] || roomId;
  const roomDir = path.join(baseDir, roomName);
  if (!fs.existsSync(roomDir)) fs.mkdirSync(roomDir, { recursive: true });

  const roomPhotos = photos[roomId] || [];
  roomPhotos.forEach((photo, idx) => {
    const base64Data = photo.base64Data || '';
    if (!base64Data) return;

    // Extract mime type and data
    const matches = base64Data.match(/^data:image\/(\w+);base64,/);
    const ext = matches ? (matches[1] === 'jpeg' ? 'jpg' : matches[1]) : 'jpg';
    const pureBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

    // Use notes as filename, fallback to index
    let noteName = (photo.notes || '').trim().replace(/[\\/:*?"<>|]/g, '_');
    if (!noteName) noteName = 'photo_' + (idx + 1);

    // Handle duplicate filenames
    let filename = noteName + '.' + ext;
    let filePath = path.join(roomDir, filename);
    let counter = 1;
    while (fs.existsSync(filePath)) {
      filename = noteName + '_' + counter + '.' + ext;
      filePath = path.join(roomDir, filename);
      counter++;
    }

    fs.writeFileSync(filePath, Buffer.from(pureBase64, 'base64'));
    totalSaved++;
    console.log('Saved: ' + roomName + '/' + filename);
  });
});

console.log('\nTotal: ' + totalSaved + ' photos saved to 现场实拍图/');
