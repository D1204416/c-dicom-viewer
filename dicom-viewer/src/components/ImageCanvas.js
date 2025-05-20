// src/components/ImageCanvas.js
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DicomContext } from '../context/DicomContext';
import * as dwv from 'dwv';
import { drawLabels, drawInProgressPolygon } from '../utils/drawingUtils';

// 創建樣式來確保 dwv 容器和繪圖層可以正確顯示
const dwvStyle = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0
};

const canvasStyle = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 10, // 確保在 DWV 上方
  pointerEvents: 'none' // 默認不接收滑鼠事件，只在繪圖模式時啟用
};

// 安全初始化 DWV
if (typeof dwv.utils === 'undefined') {
  dwv.utils = {};
}
if (typeof dwv.utils.decodeQuery === 'undefined') {
  dwv.utils.decodeQuery = function() { return {}; };
}

const ImageCanvas = () => {
  const {
    dicomFile,
    dicomImage,
    isDrawing,
    setIsDrawing,
    labels,
    setLabels,
    polygonPointsRef,
    addPointToPolygon,
    completePolygon
  } = useContext(DicomContext);
  
  // 引用 DWV 容器和應用程式
  const dwvContainerRef = useRef(null);
  const [dwvApp, setDwvApp] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  
  // 引用繪圖 Canvas
  const drawingCanvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  // 初始化 DWV
  useEffect(() => {
    // 如果已經初始化，則不重複初始化
    if (dwvApp !== null) {
      return;
    }

    try {
      // 確保 DOM 元素存在
      if (!dwvContainerRef.current) {
        console.error("DWV container not found");
        return;
      }

      // 創建 DWV 實例
      console.log("Initializing DWV for image display only...");
      
      // 創建最簡單的 DWV 配置（僅用於顯示）
      const config = {
        dataViewConfigs: { "*": [{ divId: "dwv-container" }] }
      };

      const app = new dwv.App();
      app.init(config);
      
      // 保存應用引用
      setDwvApp(app);
      
      // 添加載入完成事件
      app.addEventListener('load', function() {
        console.log('DWV: Image loaded successfully');
        
        // 獲取影像尺寸
        try {
          const image = app.getImage(0);
          if (image) {
            const viewSize = app.getLayerController().getActiveViewLayer().getViewController().getImageSize();
            setCanvasSize({
              width: viewSize.x || image.getGeometry().getSize().getNumberOfColumns(),
              height: viewSize.y || image.getGeometry().getSize().getNumberOfRows()
            });
            console.log('Image size:', viewSize);
          }
        } catch (e) {
          console.error('Error getting image size:', e);
        }
      });
      
      console.log("DWV initialized for viewing");
    } catch (error) {
      console.error("Failed to initialize DWV:", error);
    }
    
    // 清理函數
    return () => {
      if (dwvApp) {
        try {
          console.log("Resetting DWV app");
          dwvApp.reset();
        } catch (e) {
          console.error("Error resetting DWV app:", e);
        }
      }
    };
  }, []);

  // 當 dicomImage 變更且 dwvApp 已初始化時加載圖像
  useEffect(() => {
    if (!dwvApp || !dicomImage || !dicomImage.dicomData || dicomImage === currentImage) {
      return;
    }
    
    console.log('Loading DICOM data into DWV viewer');
    
    try {
      // 重置應用程式
      dwvApp.reset();
      
      // 載入 DICOM 檔案
      dwvApp.loadURLs([dicomImage.dicomData.blobUrl]);
      
      // 更新當前加載的圖像
      setCurrentImage(dicomImage);
    } catch (error) {
      console.error('Error loading DICOM into DWV:', error);
    }
  }, [dicomImage, dwvApp, currentImage]);
  
  // 更新 Canvas 尺寸
  useEffect(() => {
    if (drawingCanvasRef.current && canvasSize.width > 0 && canvasSize.height > 0) {
      const canvas = drawingCanvasRef.current;
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      
      // 重繪所有標記
      drawLabels(canvas, labels);
    }
  }, [canvasSize, labels]);
  
  // 標記模式開關
  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
    
    // 更新 Canvas 的滑鼠事件處理
    if (drawingCanvasRef.current) {
      drawingCanvasRef.current.style.pointerEvents = !isDrawing ? 'auto' : 'none';
    }
  };
  
  // 處理滑鼠事件來繪製標記
  const handleMouseDown = (e) => {
    if (!isDrawing) return;
    
    const canvas = drawingCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    const points = polygonPointsRef.current;
    
    // 如果是第一個點或接近第一個點並且有至少 3 個點
    if (points.length === 0) {
      addPointToPolygon(x, y);
    } else if (
      points.length > 2 &&
      Math.abs(x - points[0].x) < 10 &&
      Math.abs(y - points[0].y) < 10
    ) {
      // 完成多邊形
      completePolygon();
      
      // 重繪所有標記
      drawLabels(canvas, labels);
    } else {
      // 添加點到多邊形
      addPointToPolygon(x, y);
    }
    
    // 繪製進行中的多邊形
    drawInProgressPolygon(canvas, polygonPointsRef.current);
  };
  
  // 處理滑鼠移動
  const handleMouseMove = (e) => {
    if (!isDrawing || polygonPointsRef.current.length === 0) return;
    
    const canvas = drawingCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    // 繪製進行中的多邊形
    drawInProgressPolygon(canvas, polygonPointsRef.current, x, y);
  };

  return (
    <div className="canvas-container">
      {/* DWV 容器 */}
      <div 
        id="dwv-container" 
        ref={dwvContainerRef} 
        style={dwvStyle}
      ></div>
      
      {/* 手動繪圖 Canvas */}
      <canvas 
        ref={drawingCanvasRef}
        style={{
          ...canvasStyle,
          pointerEvents: isDrawing ? 'auto' : 'none'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      />
      
      {/* 簡單的工具按鈕 */}
      <div className="simple-tools" style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        zIndex: 1000,
        background: 'rgba(255,255,255,0.7)',
        padding: '5px',
        borderRadius: '5px'
      }}>
        <button 
          onClick={toggleDrawing} 
          style={{
            margin: '0 5px',
            backgroundColor: isDrawing ? '#4CAF50' : '#f0f0f0'
          }}
        >
          {isDrawing ? 'Cancel Drawing' : 'Start Drawing'}
        </button>
      </div>
      
      {!dicomFile && (
        <div className="placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">×</div>
            <div>Dicom Image</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCanvas;