/**
 * 数据恢复脚本
 * 从本地备份文件恢复数据到服务器
 * 使用 POST /api/data/restore 端点
 *
 * 用法: node scripts/restore.js [备份文件路径]
 * 如果不指定文件，使用最新的备份
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = 'https://zhongtian-yangzhu-production.up.railway.app';
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

async function restore() {
  // 确定备份文件
  let backupFile = process.argv[2];

  if (!backupFile) {
    // 使用最新的备份文件
    if (!fs.existsSync(BACKUP_DIR)) {
      console.error('备份目录不存在');
      process.exit(1);
    }
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
      .sort();
    if (files.length === 0) {
      console.error('没有找到备份文件');
      process.exit(1);
    }
    backupFile = path.join(BACKUP_DIR, files[files.length - 1]);
    console.log(`使用最新备份: ${files[files.length - 1]}`);
  }

  if (!path.isAbsolute(backupFile)) {
    backupFile = path.resolve(backupFile);
  }

  if (!fs.existsSync(backupFile)) {
    console.error(`备份文件不存在: ${backupFile}`);
    process.exit(1);
  }

  console.log(`读取备份文件: ${backupFile}`);
  const fileSizeMB = (fs.statSync(backupFile).size / 1024 / 1024).toFixed(1);
  console.log(`文件大小: ${fileSizeMB} MB`);

  const data = JSON.parse(fs.readFileSync(backupFile, 'utf-8'));

  // 统计备份数据
  const stats = {
    deliverySpecs: Object.values(data.deliverySpecs || {}).reduce((sum, specs) => sum + specs.length, 0),
    furnishingItems: data.furnishingItems?.length || 0,
    photos: Object.values(data.photos || {}).reduce((sum, photos) => sum + photos.length, 0),
    measurements: Object.keys(data.measurements || {}).length,
  };
  console.log(`交付标准: ${stats.deliverySpecs} 条`);
  console.log(`软装物品: ${stats.furnishingItems} 项`);
  console.log(`照片: ${stats.photos} 张`);
  console.log(`测量数据: ${stats.measurements} 个房间`);

  // 确认恢复
  console.log('\n即将恢复数据到服务器，这会覆盖服务器上的所有数据！');
  console.log('按 Ctrl+C 取消，或等待 3 秒后自动继续...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('\n正在恢复数据...');
  const res = await fetch(`${API_BASE}/api/data/restore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('恢复失败:', res.status, text);
    process.exit(1);
  }

  const result = await res.json();
  console.log('\n恢复成功!', result);

  // 验证恢复
  console.log('\n验证数据...');
  const verifyRes = await fetch(`${API_BASE}/api/data`);
  if (verifyRes.ok) {
    const verifyData = await verifyRes.json();
    const verifyStats = {
      deliverySpecs: Object.values(verifyData.deliverySpecs || {}).reduce((sum, specs) => sum + specs.length, 0),
      furnishingItems: verifyData.furnishingItems?.length || 0,
      photos: Object.values(verifyData.photos || {}).reduce((sum, photos) => sum + photos.length, 0),
    };
    console.log(`服务器交付标准: ${verifyStats.deliverySpecs} 条`);
    console.log(`服务器软装物品: ${verifyStats.furnishingItems} 项`);
    console.log(`服务器照片: ${verifyStats.photos} 张`);

    if (verifyStats.deliverySpecs === stats.deliverySpecs && verifyStats.furnishingItems === stats.furnishingItems) {
      console.log('\n数据验证通过!');
    } else {
      console.warn('\n数据验证异常，请检查!');
    }
  }
}

restore().catch(err => {
  console.error('恢复失败:', err);
  process.exit(1);
});
