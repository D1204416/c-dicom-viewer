// src/utils/drawingUtils.js
export const renderDicomImage = (image, canvas) => {
  if (!image || !canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // 設置 Canvas 尺寸
  canvas.width = image.width;
  canvas.height = image.height;
  
  // 清空 Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 獲取像素資料
  const pixelData = image.getPixelData();
  
  if (!pixelData || pixelData.length === 0) {
    // 如果沒有像素資料，顯示預設圖示
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#9ca3af';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Image data not available', canvas.width / 2, canvas.height / 2);
    return;
  }
  
  // 創建 ImageData
  const imageData = ctx.createImageData(image.width, image.height);
  
  // 找出像素資料的最小值和最大值以進行自動窗口化
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  
  for (let i = 0; i < pixelData.length; i++) {
    // 應用重縮放因子
    const value = pixelData[i] * image.rescaleSlope + image.rescaleIntercept;
    if (value < min) min = value;
    if (value > max) max = value;
  }
  
  // 如果無法確定範圍，使用合理的預設值
  if (min === Number.MAX_VALUE || max === Number.MIN_VALUE) {
    if (image.bitsAllocated === 16) {
      // 對於 16 位資料，使用 12 位範圍（醫療影像常見）
      min = 0;
      max = 4095; // 2^12 - 1
    } else {
      min = 0;
      max = 255;
    }
  }
  
  // 打印檢測到的值範圍
  console.log('Detected pixel value range:', { min, max });
  
  // 設置自動窗寬窗位或使用合理預設值
  let windowWidth = max - min;
  let windowCenter = min + windowWidth / 2;
  
  // 對於 CT 影像，常見窗位在 40-60 範圍，窗寬在 350-500 範圍（肺部更寬）
  if (windowWidth > 4000) {
    // 可能是 CT 影像，使用更合理的窗寬窗位
    windowWidth = 400;
    windowCenter = 40;
  }
  
  console.log('Applied window settings:', { windowWidth, windowCenter });
  
  // 處理不同的影像格式
  const isMonochrome = image.photometricInterpretation.startsWith('MONOCHROME');
  const invert = image.photometricInterpretation === 'MONOCHROME1';
  
  // 窗寬窗位計算參數
  const low = windowCenter - windowWidth / 2;
  const high = windowCenter + windowWidth / 2;
  const scale = 255 / (high - low);
  
  // 處理像素資料
  for (let i = 0; i < pixelData.length; i++) {
    let pixelValue = pixelData[i];
    
    // 應用重縮放因子（如果適用）
    if (image.rescaleSlope !== 1 || image.rescaleIntercept !== 0) {
      pixelValue = pixelValue * image.rescaleSlope + image.rescaleIntercept;
    }
    
    // 應用窗寬窗位
    let value;
    if (pixelValue <= low) {
      value = 0;
    } else if (pixelValue >= high) {
      value = 255;
    } else {
      value = Math.round((pixelValue - low) * scale);
    }
    
    // 如果是 MONOCHROME1，反轉值
    if (invert) {
      value = 255 - value;
    }
    
    // 確保值在 0-255 範圍內
    value = Math.max(0, Math.min(255, value));
    
    // 設置 RGBA 值
    const offset = i * 4;
    imageData.data[offset] = value;     // R
    imageData.data[offset + 1] = value; // G
    imageData.data[offset + 2] = value; // B
    imageData.data[offset + 3] = 255;   // A
  }
  
  // 將 ImageData 放到 Canvas 上
  ctx.putImageData(imageData, 0, 0);
};


// 其他函數保持不變...

export const drawLabels = (canvas, labels) => {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Clear drawing canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw each label
  labels.forEach(label => {
    const { points, color } = label;
    if (points.length < 3) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    
    ctx.closePath();
    ctx.fillStyle = `${color}40`; // Add transparency
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  });
};

export const drawInProgressPolygon = (canvas, points, previewX, previewY) => {
  if (!canvas || points.length === 0) return;
  
  const ctx = canvas.getContext('2d');
  
  // Clear drawing canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw in-progress polygon
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  
  // Draw preview line if previewX and previewY provided
  if (previewX !== undefined && previewY !== undefined) {
    ctx.lineTo(previewX, previewY);
  }
  
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw points
  points.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#3B82F6';
    ctx.fill();
  });
  
  // Highlight first point when near completion
  if (points.length > 2) {
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, 6, 0, 2 * Math.PI);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};