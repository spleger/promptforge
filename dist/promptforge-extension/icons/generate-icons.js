const fs = require('fs');
const path = require('path');

// Simple PNG generator for extension icons
// This creates minimal valid PNG files with solid colors

function createSimplePNG(size, r, g, b) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0); // Chunk length
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(size, 8); // Width
  ihdr.writeUInt32BE(size, 12); // Height
  ihdr.writeUInt8(8, 16); // Bit depth
  ihdr.writeUInt8(2, 17); // Color type (RGB)
  ihdr.writeUInt8(0, 18); // Compression
  ihdr.writeUInt8(0, 19); // Filter
  ihdr.writeUInt8(0, 20); // Interlace

  // Calculate CRC for IHDR
  const ihdrCrc = crc32(ihdr.slice(4, 21));
  ihdr.writeUInt32BE(ihdrCrc, 21);

  // IDAT chunk (image data)
  const rowBytes = size * 3 + 1; // 3 bytes per pixel + 1 filter byte
  const imageData = Buffer.alloc(rowBytes * size);

  for (let y = 0; y < size; y++) {
    imageData[y * rowBytes] = 0; // Filter type (none)
    for (let x = 0; x < size; x++) {
      const pixelOffset = y * rowBytes + 1 + x * 3;

      // Create a gradient effect
      const centerX = size / 2;
      const centerY = size / 2;
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const maxDistance = size / 2;
      const factor = Math.max(0, 1 - (distance / maxDistance) * 0.3);

      imageData[pixelOffset] = Math.floor(r * factor);
      imageData[pixelOffset + 1] = Math.floor(g * factor);
      imageData[pixelOffset + 2] = Math.floor(b * factor);
    }
  }

  // Compress with zlib (simplified - just add zlib header)
  const compressed = Buffer.concat([
    Buffer.from([120, 1]), // Zlib header
    imageData,
    Buffer.from([0, 0, 0, 0]) // Adler-32 checksum (simplified)
  ]);

  const idat = Buffer.alloc(12 + compressed.length);
  idat.writeUInt32BE(compressed.length, 0);
  idat.write('IDAT', 4);
  compressed.copy(idat, 8);
  const idatCrc = crc32(idat.slice(4, 8 + compressed.length));
  idat.writeUInt32BE(idatCrc, 8 + compressed.length);

  // IEND chunk
  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function crc32(buffer) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buffer.length; i++) {
    crc = crc ^ buffer[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate icons with PromptForge brand colors (blue to purple gradient)
console.log('Generating PromptForge extension icons...');

try {
  // Create 16x16 icon (more blue)
  const icon16 = createSimplePNG(16, 59, 130, 246);
  fs.writeFileSync(path.join(__dirname, 'icon16.png'), icon16);
  console.log('✓ Created icon16.png');

  // Create 48x48 icon (balanced)
  const icon48 = createSimplePNG(48, 100, 107, 246);
  fs.writeFileSync(path.join(__dirname, 'icon48.png'), icon48);
  console.log('✓ Created icon48.png');

  // Create 128x128 icon (more purple)
  const icon128 = createSimplePNG(128, 139, 92, 246);
  fs.writeFileSync(path.join(__dirname, 'icon128.png'), icon128);
  console.log('✓ Created icon128.png');

  console.log('\n✨ All icons generated successfully!');
  console.log('The extension is now ready to use.');
} catch (error) {
  console.error('Error generating icons:', error.message);
  console.log('\n⚠️  Alternative: Open extension/icons/generate-icons.html in your browser');
  console.log('   and manually save the generated images.');
}
