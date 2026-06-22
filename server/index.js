import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
// 优先使用持久化卷目录（Railway Volume 挂载点），回退到本地目录
const DATA_DIR = fs.existsSync('/app/data') ? '/app/data' : __dirname;
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const DIST_DIR = path.join(__dirname, 'dist');
const PHOTOS_DIR = path.join(DATA_DIR, 'photos');

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 确保照片目录存在
if (!fs.existsSync(PHOTOS_DIR)) {
  fs.mkdirSync(PHOTOS_DIR, { recursive: true });
}

// 读取数据
function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('读取数据失败:', err);
  }
  return null;
}

// 写入数据
function writeData(data) {
  try {
    const tmpFile = DATA_FILE + '.tmp';
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DATA_FILE);
    return true;
  } catch (err) {
    console.error('写入数据失败:', err);
    return false;
  }
}

// 从 photos 对象中剥离 base64Data
function stripPhotosBase64(data) {
  if (!data.photos) return data;
  const stripped = { ...data };
  stripped.photos = {};
  for (const [roomId, photos] of Object.entries(data.photos)) {
    stripped.photos[roomId] = photos.map(p => {
      if (p.base64Data) {
        const { base64Data, ...rest } = p;
        return rest;
      }
      return p;
    });
  }
  return stripped;
}

// 自动迁移：将 base64Data 转为文件存储
function migratePhotos() {
  const data = readData();
  if (!data || !data.photos) return;

  let migrated = false;
  for (const [roomId, photos] of Object.entries(data.photos)) {
    for (const photo of photos) {
      if (photo.base64Data) {
        const pureBase64 = photo.base64Data.replace(/^data:image\/\w+;base64,/, '');
        if (!pureBase64) continue;

        // 保存原图
        const imagePath = path.join(PHOTOS_DIR, `${photo.id}.jpg`);
        if (!fs.existsSync(imagePath)) {
          fs.writeFileSync(imagePath, Buffer.from(pureBase64, 'base64'));
        }

        // 保存缩略图（迁移时用原图代替，新上传的会有真正的缩略图）
        const thumbPath = path.join(PHOTOS_DIR, `${photo.id}_thumb.jpg`);
        if (!fs.existsSync(thumbPath)) {
          fs.copyFileSync(imagePath, thumbPath);
        }

        // 移除 base64Data
        delete photo.base64Data;
        migrated = true;
      }
    }
  }

  if (migrated) {
    writeData(data);
    console.log('照片数据已从 base64 迁移到文件存储');
  }
}

// 执行迁移
migratePhotos();

// ─── API 路由 ───

// GET /api/data - 获取全部数据（不含照片 base64）
app.get('/api/data', (req, res) => {
  const data = readData();
  if (data) {
    res.json(stripPhotosBase64(data));
  } else {
    res.json({});
  }
});

// PUT /api/data - 保存全部数据（自动剥离照片 base64）
app.put('/api/data', (req, res) => {
  const data = req.body;

  // 安全措施：如果前端仍发送了 base64Data，保存为文件并剥离
  if (data.photos) {
    for (const [roomId, photos] of Object.entries(data.photos)) {
      for (const photo of photos) {
        if (photo.base64Data) {
          const pureBase64 = photo.base64Data.replace(/^data:image\/\w+;base64,/, '');
          if (pureBase64) {
            const imagePath = path.join(PHOTOS_DIR, `${photo.id}.jpg`);
            if (!fs.existsSync(imagePath)) {
              fs.writeFileSync(imagePath, Buffer.from(pureBase64, 'base64'));
            }
            const thumbPath = path.join(PHOTOS_DIR, `${photo.id}_thumb.jpg`);
            if (!fs.existsSync(thumbPath)) {
              fs.copyFileSync(imagePath, thumbPath);
            }
          }
          delete photo.base64Data;
        }
      }
    }
  }

  const success = writeData(data);
  if (success) {
    res.json({ ok: true });
  } else {
    res.status(500).json({ ok: false, error: '写入失败' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 照片文件 API ───

// POST /api/photos/upload - 上传照片（imageData + thumbnailData 为 base64）
app.post('/api/photos/upload', (req, res) => {
  const { roomId, id, notes, takenDate, imageData, thumbnailData } = req.body;

  if (!roomId || !id || !imageData) {
    return res.status(400).json({ error: '缺少必要字段' });
  }

  try {
    // 保存原图
    const pureImage = imageData.replace(/^data:image\/\w+;base64,/, '');
    const imagePath = path.join(PHOTOS_DIR, `${id}.jpg`);
    fs.writeFileSync(imagePath, Buffer.from(pureImage, 'base64'));

    // 保存缩略图
    if (thumbnailData) {
      const pureThumb = thumbnailData.replace(/^data:image\/\w+;base64,/, '');
      const thumbPath = path.join(PHOTOS_DIR, `${id}_thumb.jpg`);
      fs.writeFileSync(thumbPath, Buffer.from(pureThumb, 'base64'));
    }

    res.json({ ok: true, id });
  } catch (err) {
    console.error('照片上传失败:', err);
    res.status(500).json({ error: '照片保存失败' });
  }
});

// GET /api/photos/:photoId - 获取原图
app.get('/api/photos/:photoId', (req, res) => {
  const filePath = path.join(PHOTOS_DIR, `${req.params.photoId}.jpg`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: '照片不存在' });
  }
});

// GET /api/photos/:photoId/thumbnail - 获取缩略图
app.get('/api/photos/:photoId/thumbnail', (req, res) => {
  const thumbPath = path.join(PHOTOS_DIR, `${req.params.photoId}_thumb.jpg`);
  if (fs.existsSync(thumbPath)) {
    res.sendFile(thumbPath);
  } else {
    // 回退到原图
    const filePath = path.join(PHOTOS_DIR, `${req.params.photoId}.jpg`);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: '照片不存在' });
    }
  }
});

// DELETE /api/photos/:photoId - 删除照片文件
app.delete('/api/photos/:photoId', (req, res) => {
  const photoId = req.params.photoId;
  const imagePath = path.join(PHOTOS_DIR, `${photoId}.jpg`);
  const thumbPath = path.join(PHOTOS_DIR, `${photoId}_thumb.jpg`);

  try {
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    res.json({ ok: true });
  } catch (err) {
    console.error('照片删除失败:', err);
    res.status(500).json({ error: '照片删除失败' });
  }
});

// 托管前端静态文件（部署时使用）
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  // SPA 路由回退：所有非 API、非静态文件的请求返回 index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`服务端运行在端口 ${PORT}`);
  console.log(`数据文件路径: ${DATA_FILE}`);
  console.log(`照片文件路径: ${PHOTOS_DIR}`);
  console.log(`前端静态文件目录: ${DIST_DIR} (${fs.existsSync(DIST_DIR) ? '存在' : '不存在'})`);

  // 启动时：如果持久化目录没有数据但本地有，自动迁移
  if (DATA_DIR !== __dirname) {
    const localDataFile = path.join(__dirname, 'data.json');
    if (!fs.existsSync(DATA_FILE) && fs.existsSync(localDataFile)) {
      try {
        const data = fs.readFileSync(localDataFile, 'utf-8');
        fs.writeFileSync(DATA_FILE, data, 'utf-8');
        console.log('已将本地数据迁移到持久化卷');
      } catch (err) {
        console.error('数据迁移失败:', err);
      }
    }
  }
});
