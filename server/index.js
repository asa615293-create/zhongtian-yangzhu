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
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const MAX_BACKUPS = 5;

app.use(cors());
app.use(express.json({ limit: '200mb' }));

// 确保备份目录存在
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// 读取数据
function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (data && Object.keys(data).length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.error('读取数据失败:', err);
  }
  return null;
}

// 写入数据（原子写入）
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

// 自动备份：在写入前保存备份（保留最近 N 个）
function createBackup() {
  try {
    if (!fs.existsSync(DATA_FILE)) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `backup_${timestamp}.json`);
    fs.copyFileSync(DATA_FILE, backupFile);

    // 清理旧备份，只保留最近 MAX_BACKUPS 个
    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
      .sort();
    while (backups.length > MAX_BACKUPS) {
      const oldBackup = backups.shift();
      fs.unlinkSync(path.join(BACKUP_DIR, oldBackup));
    }
  } catch (err) {
    console.error('创建备份失败:', err);
  }
}

// 从 photos 对象中剥离 base64Data（仅用于 API 响应，不影响存储）
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

// ─── API 路由 ───

// GET /api/data - 获取全部数据（不含照片 base64，快速加载）
app.get('/api/data', (req, res) => {
  const data = readData();
  if (data) {
    res.json(stripPhotosBase64(data));
  } else {
    res.json({});
  }
});

// GET /api/photos/:roomId - 获取指定房间的完整照片数据（含 base64Data）
app.get('/api/photos/:roomId', (req, res) => {
  const data = readData();
  if (!data || !data.photos) {
    return res.json([]);
  }
  const roomPhotos = data.photos[req.params.roomId] || [];
  res.json(roomPhotos);
});

// PUT /api/data - 保存全部数据（完整保存，不剥离 base64Data）
app.put('/api/data', (req, res) => {
  const data = req.body;
  createBackup();
  const success = writeData(data);
  if (success) {
    res.json({ ok: true });
  } else {
    res.status(500).json({ ok: false, error: '写入失败' });
  }
});

// POST /api/data/restore - 从上传的 JSON 恢复数据
app.post('/api/data/restore', (req, res) => {
  const data = req.body;
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ ok: false, error: '无效的数据格式' });
  }
  createBackup();
  const success = writeData(data);
  if (success) {
    res.json({ ok: true });
  } else {
    res.status(500).json({ ok: false, error: '恢复失败' });
  }
});

// DELETE /api/photos/:photoId - 从数据中删除指定照片
app.delete('/api/photos/:photoId', (req, res) => {
  const photoId = req.params.photoId;
  const data = readData();
  if (!data || !data.photos) {
    return res.json({ ok: true });
  }

  let found = false;
  for (const [roomId, photos] of Object.entries(data.photos)) {
    const idx = photos.findIndex(p => p.id === photoId);
    if (idx >= 0) {
      data.photos[roomId].splice(idx, 1);
      found = true;
      break;
    }
  }

  if (found) {
    createBackup();
    writeData(data);
  }

  res.json({ ok: true });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
  console.log(`备份目录路径: ${BACKUP_DIR}`);
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
