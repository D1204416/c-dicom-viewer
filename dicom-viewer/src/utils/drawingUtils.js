// src/utils/drawingUtils.js
export const drawLabels = (canvas, labels) => {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // 清空 Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 繪製每個標記
  labels.forEach(label => {
    const { points, color } = label;
    if (points.length < 3) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    
    ctx.closePath();
    ctx.fillStyle = `${color}40`; // 添加透明度
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  });
};

export const drawInProgressPolygon = (canvas, points, previewX, previewY) => {
  if (!canvas || points.length === 0) return;
  
  const ctx = canvas.getContext('2d');
  
  // 清空 Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 繪製進行中的多邊形
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  
  // 繪製預覽線
  if (previewX !== undefined && previewY !== undefined) {
    ctx.lineTo(previewX, previewY);
  }
  
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 繪製點
  points.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#3B82F6';
    ctx.fill();
  });
  
  // 強調第一個點
  if (points.length > 2) {
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, 6, 0, 2 * Math.PI);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};