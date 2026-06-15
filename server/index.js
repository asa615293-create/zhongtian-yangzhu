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

app.use(cors());
app.use(express.json({ limit: '50mb' }));

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

// API 路由
// GET /api/data - 获取全部数据
app.get('/api/data', (req, res) => {
  const data = readData();
  if (data) {
    res.json(data);
  } else {
    res.json({});
  }
});

// PUT /api/data - 保存全部数据
app.put('/api/data', (req, res) => {
  const success = writeData(req.body);
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
