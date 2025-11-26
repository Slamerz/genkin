#!/usr/bin/env bun

import { gzipSizeSync } from 'gzip-size';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface BundleInfo {
  file: string;
  size: number;
  gzipSize: number;
  format: 'ESM' | 'CJS';
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundleSize(filePath: string): BundleInfo {
  const content = readFileSync(filePath, 'utf-8');
  const size = statSync(filePath).size;
  const gzipped = gzipSizeSync(content);
  const format = filePath.endsWith('.cjs') ? 'CJS' : 'ESM';
  
  return {
    file: filePath,
    size,
    gzipSize: gzipped,
    format
  };
}

async function main() {
  const distDir = './dist';
  
  try {
    const files = readdirSync(distDir)
      .filter(file => file.endsWith('.js') || file.endsWith('.cjs'))
      .map(file => join(distDir, file));

    const bundleInfos: BundleInfo[] = files.map(analyzeBundleSize);
    
    console.log('\n📦 Bundle Size Analysis\n');
    console.log('═'.repeat(80));
    
    // Group by format
    const esmBundles = bundleInfos.filter(b => b.format === 'ESM');
    const cjsBundles = bundleInfos.filter(b => b.format === 'CJS');
    
    [
      { title: '🌟 ESM Bundles', bundles: esmBundles },
      { title: '📄 CJS Bundles', bundles: cjsBundles }
    ].forEach(({ title, bundles }) => {
      if (bundles.length === 0) return;
      
      console.log(`\n${title}\n`);
      console.log('File'.padEnd(20) + 'Raw Size'.padEnd(15) + 'Gzipped'.padEnd(15) + 'Compression');
      console.log('─'.repeat(65));
      
      bundles.forEach(bundle => {
        const fileName = bundle.file.replace('./dist/', '');
        const compressionRatio = ((1 - bundle.gzipSize / bundle.size) * 100).toFixed(1);
        
        console.log(
          fileName.padEnd(20) +
          formatBytes(bundle.size).padEnd(15) +
          formatBytes(bundle.gzipSize).padEnd(15) +
          `${compressionRatio}%`
        );
      });
    });
    
    // Summary
    const totalRawSize = bundleInfos.reduce((sum, b) => sum + b.size, 0);
    const totalGzipSize = bundleInfos.reduce((sum, b) => sum + b.gzipSize, 0);
    const overallCompression = ((1 - totalGzipSize / totalRawSize) * 100).toFixed(1);
    
    console.log('\n' + '═'.repeat(80));
    console.log('📊 Summary');
    console.log('─'.repeat(20));
    console.log(`Total Raw Size:    ${formatBytes(totalRawSize)}`);
    console.log(`Total Gzipped:     ${formatBytes(totalGzipSize)}`);
    console.log(`Overall Compression: ${overallCompression}%`);
    console.log(`Bundle Count:      ${bundleInfos.length}`);
    
    // Warnings for large bundles
    const largeBundles = bundleInfos.filter(b => b.gzipSize > 20 * 1024); // > 20KB gzipped
    if (largeBundles.length > 0) {
      console.log('\n⚠️  Large Bundle Warning:');
      largeBundles.forEach(bundle => {
        console.log(`   ${bundle.file.replace('./dist/', '')} - ${formatBytes(bundle.gzipSize)} gzipped`);
      });
    }
    
    console.log('\n');
    
  } catch (error) {
    console.error('❌ Error analyzing bundle sizes:', error);
    process.exit(1);
  }
}

main(); 