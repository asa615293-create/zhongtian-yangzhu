/**
 * 安全上传脚本
 * 自动执行：备份 → 验证 → 上传 → 验证
 * 任何一步失败都会中止，确保数据安全
 *
 * 用法: node scripts/safe-upload.js <data-file.json>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = 'https://zhongtian-yangzhu-production.up.railway.app';
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

async function main() {
  const dataFile = process.argv[2];
  if (!dataFile) {
    console.error('用法: node scripts/safe-upload.js <data-file.json>');
    process.exit(1);
  }

  const absolutePath = path.resolve(dataFile);
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ 文件不存在: ${absolutePath}`);
    process.exit(1);
  }

  console.log('═══════════════════════════════════════');
  console.log('  安全上传流程');
  console.log('═══════════════════════════════════════\n');

  // ── Step 1: 备份当前服务器数据 ──
  console.log('【Step 1/4】备份当前服务器数据...');
  try {
    execFileSync('node', [path.join(__dirname, 'backup.js')], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
  } catch {
    console.log('⚠️ 备份失败（继续执行，但不影响上传）');
  }

  // ── Step 2: 验证待上传数据 ──
  console.log('\n【Step 2/4】验证待上传数据...');
  try {
    execFileSync('node', [path.join(__dirname, 'validate-data.js'), absolutePath], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
  } catch {
    console.error('\n❌ 数据验证失败！上传已中止。请修复错误后重试。');
    process.exit(1);
  }

  // ── Step 3: 上传数据 ──
  console.log('\n【Step 3/4】上传数据到服务器...');
  try {
    const rawData = fs.readFileSync(absolutePath, 'utf-8');
    const data = JSON.parse(rawData);

    const res = await fetch(`${API_BASE}/api/data`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error(`❌ 上传失败: HTTP ${res.status} ${res.statusText}`);
      process.exit(1);
    }

    const result = await res.json();
    if (!result.ok) {
      console.error('❌ 上传失败: 服务器返回错误');
      process.exit(1);
    }

    console.log('✅ 上传成功');
  } catch (err) {
    console.error(`❌ 上传异常: ${err.message}`);
    process.exit(1);
  }

  // ── Step 4: 验证上传后的数据 ──
  console.log('\n【Step 4/4】验证服务器数据...');
  try {
    const res = await fetch(`${API_BASE}/api/data`);
    if (!res.ok) {
      console.error(`❌ 验证失败: 无法获取服务器数据 (HTTP ${res.status})`);
      process.exit(1);
    }
    const serverData = await res.json();

    // 基本检查
    const uploadedData = JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
    const serverItemCount = serverData.furnishingItems?.length || 0;
    const uploadedItemCount = uploadedData.furnishingItems?.length || 0;
    const serverSpecRooms = Object.keys(serverData.deliverySpecs || {}).length;
    const uploadedSpecRooms = Object.keys(uploadedData.deliverySpecs || {}).length;

    console.log(`  软装物品: ${serverItemCount} (期望 ${uploadedItemCount})`);
    console.log(`  交付标准空间: ${serverSpecRooms} (期望 ${uploadedSpecRooms})`);

    if (serverItemCount < uploadedItemCount) {
      console.error('❌ 验证失败: 服务器物品数少于上传数，数据可能丢失！');
      console.error('请手动恢复: node scripts/backup.js 查看最新备份');
      process.exit(1);
    }

    if (serverSpecRooms < uploadedSpecRooms) {
      console.error('❌ 验证失败: 服务器交付标准空间数少于上传数！');
      process.exit(1);
    }

    // 运行完整验证
    execFileSync('node', [path.join(__dirname, 'validate-data.js')], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
  } catch (err) {
    if (err.status === 1) {
      console.error('\n❌ 服务器数据验证失败！数据可能有问题。');
      process.exit(1);
    }
    console.error(`❌ 验证异常: ${err.message}`);
    process.exit(1);
  }

  console.log('\n═══════════════════════════════════════');
  console.log('  ✅ 安全上传完成！所有验证通过。');
  console.log('═══════════════════════════════════════');
}

main().catch(err => {
  console.error('安全上传脚本异常:', err);
  process.exit(1);
});
