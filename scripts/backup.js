/**
 * 数据备份脚本
 * 从服务器获取全部数据（含图片）保存到本地 backups/ 目录
 * 文件名格式: backup_YYYY-MM-DD_HH-mm-ss.json
 *
 * 用法: node scripts/backup.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = 'https://zhongtian-yangzhu-production.up.railway.app';
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

async function backup() {
  // 确保备份目录存在
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  console.log('正在从服务器获取数据...');

  const res = await fetch(`${API_BASE}/api/data`);
  if (!res.ok) {
    console.error('获取数据失败:', res.status, res.statusText);
    process.exit(1);
  }

  const data = await res.json();

  // 生成文件名
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const filename = `backup_${timestamp}.json`;
  const filepath = path.join(BACKUP_DIR, filename);

  // 写入文件
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');

  // 统计信息
  const stats = {
    furnishingItems: data.furnishingItems?.length || 0,
    rooms: data.rooms?.length || 0,
    designSchemes: data.designSchemes?.length || 0,
    budgetTarget: data.budgetTarget || 0,
    photos: Object.keys(data.photos || {}).reduce((sum, key) => sum + (data.photos[key]?.length || 0), 0),
  };

  const fileSizeKB = (fs.statSync(filepath).size / 1024).toFixed(1);

  console.log(`\n备份完成!`);
  console.log(`  文件: ${filename}`);
  console.log(`  大小: ${fileSizeKB} KB`);
  console.log(`  物品数: ${stats.furnishingItems}`);
  console.log(`  空间数: ${stats.rooms}`);
  console.log(`  设计方案: ${stats.designSchemes}`);
  console.log(`  照片数: ${stats.photos}`);
  console.log(`  总预算: ¥${stats.budgetTarget?.toLocaleString()}`);

  // 清理超过30天的旧备份
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.startsWith('backup_') && f.endsWith('.json'));
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  let cleaned = 0;
  for (const file of files) {
    const filePath = path.join(BACKUP_DIR, file);
    const stat = fs.statSync(filePath);
    if (stat.mtimeMs < thirtyDaysAgo) {
      fs.unlinkSync(filePath);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    console.log(`\n已清理 ${cleaned} 个超过30天的旧备份`);
  }
}

backup().catch(err => {
  console.error('备份失败:', err);
  process.exit(1);
});
