# Linux 图标目录

此目录存放 Linux 平台的应用图标。

## 所需文件

- 16x16.png
- 32x32.png
- 48x48.png
- 64x64.png
- 128x128.png
- 256x256.png
- 512x512.png

## 生成方法

使用 ImageMagick 从 512x512 图标生成各尺寸：

```bash
for size in 16 32 48 64 128 256 512; do
  convert icon-512x512.png -resize ${size}x${size} ${size}x${size}.png
done
```
