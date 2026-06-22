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

// ─── 外部 API 鉴权中间件 ───
// API Key 通过环境变量 EXTERNAL_API_KEY 设置
// 请求时通过 Authorization: Bearer <key> 或 ?key=<key> 传递
const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY || '';

function requireApiKey(req, res, next) {
  if (!EXTERNAL_API_KEY) {
    return res.status(503).json({ ok: false, error: '外部 API 未启用（未设置 EXTERNAL_API_KEY 环境变量）' });
  }
  const authHeader = req.headers.authorization;
  const bearerKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const queryKey = req.query.key || '';
  if (bearerKey === EXTERNAL_API_KEY || queryKey === EXTERNAL_API_KEY) {
    return next();
  }
  return res.status(401).json({ ok: false, error: '无效的 API Key' });
}

// ─── 内部 API 路由 ───

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

// ─── 外部 API 路由（供 ChatGPT 等 AI 工具调用） ───
// 所有外部 API 路径以 /api/external/ 开头，需要 API Key 鉴权
// 鉴权方式：Authorization: Bearer <key> 或 ?key=<key>

// GET /api/external/data - 获取全部数据（含照片 base64Data，完整数据）
app.get('/api/external/data', requireApiKey, (req, res) => {
  const data = readData();
  if (data) {
    res.json(data);
  } else {
    res.json({});
  }
});

// GET /api/external/summary - 获取数据摘要（不含照片 base64，快速概览）
app.get('/api/external/summary', requireApiKey, (req, res) => {
  const data = readData();
  if (!data) {
    return res.json({});
  }

  const summary = {
    propertyInfo: data.propertyInfo || null,
    deliverySpecs: {},
    photos: {},
    furnishingItems: (data.furnishingItems || []).map(item => {
      const { referenceImages, ...rest } = item;
      return { ...rest, referenceImageCount: referenceImages?.length || 0 };
    }),
    measurements: data.measurements || {},
    designSchemes: (data.designSchemes || []).map(s => {
      const { base64Data, ...rest } = s;
      return rest;
    }),
  };

  // 交付标准：保留完整数据（不含 base64）
  if (data.deliverySpecs) {
    for (const [roomId, specs] of Object.entries(data.deliverySpecs)) {
      summary.deliverySpecs[roomId] = specs;
    }
  }

  // 照片：只保留元信息
  if (data.photos) {
    for (const [roomId, photos] of Object.entries(data.photos)) {
      summary.photos[roomId] = photos.map(p => {
        const { base64Data, ...rest } = p;
        return rest;
      });
    }
  }

  res.json(summary);
});

// GET /api/external/rooms - 获取所有房间列表及各房间数据概览
app.get('/api/external/rooms', requireApiKey, (req, res) => {
  const data = readData();
  if (!data) {
    return res.json([]);
  }

  const rooms = [
    { id: 'entrance', name: '玄关' },
    { id: 'living', name: '客餐厅' },
    { id: 'kitchen', name: '厨房' },
    { id: 'masterBedroom', name: '主卧' },
    { id: 'secondBedroom', name: '次卧' },
    { id: 'study', name: '书房' },
    { id: 'bathroom1', name: '主卫' },
    { id: 'bathroom2', name: '次卫' },
    { id: 'bathroom3', name: '公卫' },
    { id: 'balcony', name: '阳台' },
  ];

  const result = rooms.map(room => ({
    ...room,
    deliverySpecsCount: (data.deliverySpecs?.[room.id] || []).length,
    photosCount: (data.photos?.[room.id] || []).length,
    measurementsCount: Object.keys(data.measurements?.[room.id] || {}).length,
    furnishingItemsCount: (data.furnishingItems || []).filter(i => i.roomId === room.id).length,
  }));

  res.json(result);
});

// GET /api/external/room/:roomId - 获取指定房间完整数据（含照片 base64）
app.get('/api/external/room/:roomId', requireApiKey, (req, res) => {
  const data = readData();
  if (!data) {
    return res.json({});
  }

  const roomId = req.params.roomId;
  const roomData = {
    roomId,
    deliverySpecs: data.deliverySpecs?.[roomId] || [],
    photos: data.photos?.[roomId] || [],
    measurements: data.measurements?.[roomId] || {},
    furnishingItems: (data.furnishingItems || []).filter(i => i.roomId === roomId),
  };

  res.json(roomData);
});

// PUT /api/external/delivery-specs/:roomId - 更新指定房间的交付标准
app.put('/api/external/delivery-specs/:roomId', requireApiKey, (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(404).json({ ok: false, error: '服务器无数据' });
  }

  const roomId = req.params.roomId;
  const specs = req.body;

  if (!Array.isArray(specs)) {
    return res.status(400).json({ ok: false, error: '交付标准必须是数组' });
  }

  if (!data.deliverySpecs) data.deliverySpecs = {};
  data.deliverySpecs[roomId] = specs;

  createBackup();
  const success = writeData(data);
  if (success) {
    res.json({ ok: true, roomId, count: specs.length });
  } else {
    res.status(500).json({ ok: false, error: '写入失败' });
  }
});

// PATCH /api/external/delivery-specs/:roomId - 部分更新交付标准（按 fieldKey 匹配合并）
app.patch('/api/external/delivery-specs/:roomId', requireApiKey, (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(404).json({ ok: false, error: '服务器无数据' });
  }

  const roomId = req.params.roomId;
  const updates = req.body;

  if (!Array.isArray(updates)) {
    return res.status(400).json({ ok: false, error: '更新内容必须是数组' });
  }

  if (!data.deliverySpecs) data.deliverySpecs = {};
  if (!data.deliverySpecs[roomId]) data.deliverySpecs[roomId] = [];

  const existing = data.deliverySpecs[roomId];
  let updated = 0;
  let added = 0;

  for (const update of updates) {
    const idx = existing.findIndex(s => s.fieldKey === update.fieldKey);
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...update, roomId };
      updated++;
    } else {
      existing.push({ ...update, roomId, id: update.id || `spec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` });
      added++;
    }
  }

  createBackup();
  const success = writeData(data);
  if (success) {
    res.json({ ok: true, roomId, updated, added, total: existing.length });
  } else {
    res.status(500).json({ ok: false, error: '写入失败' });
  }
});

// PUT /api/external/furnishing-items - 替换全部软装清单
app.put('/api/external/furnishing-items', requireApiKey, (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(404).json({ ok: false, error: '服务器无数据' });
  }

  const items = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ ok: false, error: '软装清单必须是数组' });
  }

  data.furnishingItems = items;

  createBackup();
  const success = writeData(data);
  if (success) {
    res.json({ ok: true, count: items.length });
  } else {
    res.status(500).json({ ok: false, error: '写入失败' });
  }
});

// PATCH /api/external/furnishing-items - 部分更新软装清单（按 id 匹配更新，无 id 则新增）
app.patch('/api/external/furnishing-items', requireApiKey, (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(404).json({ ok: false, error: '服务器无数据' });
  }

  const updates = req.body;
  if (!Array.isArray(updates)) {
    return res.status(400).json({ ok: false, error: '更新内容必须是数组' });
  }

  if (!data.furnishingItems) data.furnishingItems = [];

  let updated = 0;
  let added = 0;

  for (const update of updates) {
    if (update.id) {
      const idx = data.furnishingItems.findIndex(i => i.id === update.id);
      if (idx >= 0) {
        data.furnishingItems[idx] = { ...data.furnishingItems[idx], ...update };
        updated++;
        continue;
      }
    }
    data.furnishingItems.push({
      ...update,
      id: update.id || `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    });
    added++;
  }

  createBackup();
  const success = writeData(data);
  if (success) {
    res.json({ ok: true, updated, added, total: data.furnishingItems.length });
  } else {
    res.status(500).json({ ok: false, error: '写入失败' });
  }
});

// POST /api/external/photos/:roomId - 为指定房间添加照片
app.post('/api/external/photos/:roomId', requireApiKey, (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(404).json({ ok: false, error: '服务器无数据' });
  }

  const roomId = req.params.roomId;
  const photos = req.body;

  // 支持单张或多张
  const photoList = Array.isArray(photos) ? photos : [photos];

  if (!data.photos) data.photos = {};
  if (!data.photos[roomId]) data.photos[roomId] = [];

  for (const photo of photoList) {
    data.photos[roomId].push({
      id: photo.id || `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      roomId,
      category: photo.category || '现场实拍',
      base64Data: photo.base64Data || '',
      takenDate: photo.takenDate || new Date().toISOString().split('T')[0],
      notes: photo.notes || '',
    });
  }

  createBackup();
  const success = writeData(data);
  if (success) {
    res.json({ ok: true, roomId, added: photoList.length, total: data.photos[roomId].length });
  } else {
    res.status(500).json({ ok: false, error: '写入失败' });
  }
});

// PUT /api/external/photos/:roomId - 替换指定房间的全部照片
app.put('/api/external/photos/:roomId', requireApiKey, (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(404).json({ ok: false, error: '服务器无数据' });
  }

  const roomId = req.params.roomId;
  const photos = req.body;

  if (!Array.isArray(photos)) {
    return res.status(400).json({ ok: false, error: '照片数据必须是数组' });
  }

  if (!data.photos) data.photos = {};
  data.photos[roomId] = photos.map(p => ({
    ...p,
    id: p.id || `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    roomId,
  }));

  createBackup();
  const success = writeData(data);
  if (success) {
    res.json({ ok: true, roomId, count: data.photos[roomId].length });
  } else {
    res.status(500).json({ ok: false, error: '写入失败' });
  }
});

// PUT /api/external/measurements/:roomId - 更新指定房间的测量数据
app.put('/api/external/measurements/:roomId', requireApiKey, (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(404).json({ ok: false, error: '服务器无数据' });
  }

  const roomId = req.params.roomId;
  const measurements = req.body;

  if (!data.measurements) data.measurements = {};
  data.measurements[roomId] = measurements;

  createBackup();
  const success = writeData(data);
  if (success) {
    res.json({ ok: true, roomId });
  } else {
    res.status(500).json({ ok: false, error: '写入失败' });
  }
});

// PUT /api/external/property-info - 更新房屋信息
app.put('/api/external/property-info', requireApiKey, (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(404).json({ ok: false, error: '服务器无数据' });
  }

  data.propertyInfo = req.body;

  createBackup();
  const success = writeData(data);
  if (success) {
    res.json({ ok: true });
  } else {
    res.status(500).json({ ok: false, error: '写入失败' });
  }
});

// GET /api/external/schema - 获取数据结构说明（帮助 AI 理解数据格式）
app.get('/api/external/schema', requireApiKey, (req, res) => {
  res.json({
    propertyInfo: {
      description: '房屋基本信息',
      fields: {
        id: 'string', name: 'string - 小区名称', location: 'string - 地址',
        area: 'number - 面积(㎡)', floor: 'string - 楼层', totalPrice: 'number - 总价',
        deposit: 'number - 定金', depositDate: 'string - 交定金日期',
        deliveryDate: 'string - 交付日期', deliveryStandard: 'string - 交付标准',
        privateElevator: 'boolean - 是否有私家电梯', panoramicWindow: 'boolean - 是否有全景窗',
        unitType: 'string - 户型',
      },
    },
    deliverySpecs: {
      description: '精装修交付标准，按房间分组',
      keyFormat: '房间ID (entrance/living/kitchen/masterBedroom/secondBedroom/study/bathroom1/bathroom2/bathroom3/balcony)',
      itemFields: {
        id: 'string', roomId: 'string - 房间ID', category: 'string - 分类',
        fieldKey: 'string - 字段标识', fieldLabel: 'string - 字段名称',
        value: 'string - 值', notes: 'string - 备注',
      },
    },
    photos: {
      description: '现场照片，按房间分组',
      keyFormat: '房间ID',
      itemFields: {
        id: 'string', roomId: 'string', category: 'string - 分类(现场实拍/问题记录/材料样板)',
        base64Data: 'string - base64编码图片数据', takenDate: 'string - 拍摄日期',
        notes: 'string - 备注',
      },
    },
    furnishingItems: {
      description: '软装清单',
      itemFields: {
        id: 'string', roomId: 'string - 房间ID', name: 'string - 名称',
        category: 'string - 品类(家具/灯具/窗帘/饰品/家电/全屋定制)',
        sizeRequirement: 'string', materialRequirement: 'string',
        colorRequirement: 'string', styleRequirement: 'string',
        brandPreference: 'string', budgetMin: 'number|null', budgetMax: 'number|null',
        actualPrice: 'number|null', priority: 'string - must/recommended/optional',
        status: 'string - pending/selected/purchased/installed',
        matchingNotes: 'string', notes: 'string',
        referenceImages: 'ReferenceImage[] - 参考图片',
        pricingMode: 'string? - standard/custom', cabinetWidth: 'number? - 柜体宽度mm',
        cabinetHeight: 'number? - 柜体高度mm', boardType: 'string? - 板材类型',
        unitPrice: 'number? - 投影面积单价元/㎡',
      },
    },
    measurements: {
      description: '测量数据，按房间分组',
      itemFields: {
        id: 'string', roomId: 'string', wallName: 'string - 墙面名称',
        width: 'number|null - 宽度mm', height: 'number|null - 高度mm', notes: 'string',
      },
    },
    designSchemes: {
      description: '设计方案',
      itemFields: {
        id: 'string', type: 'string - style/color/space/reference',
        title: 'string', description: 'string', keywords: 'string',
        base64Data: 'string - 参考图片', colorValues: 'string - 色值',
        roomId: 'string', notes: 'string',
      },
    },
  });
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
