// src/components/ImageCanvas.js
import React, { useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import DrawingTools from './DrawingTools';  // 確保已創建此組件
import { DicomContext } from '../context/DicomContext';
import * as dwv from 'dwv';

// 創建樣式來確保 dwv 容器可以正確顯示
const dwvStyle = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0
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
    canvasRef,
    drawingCanvasRef,
    isDrawing,
    polygonPointsRef,
    addPointToPolygon,
    completePolygon
  } = useContext(DicomContext);
  
  // 引用 DWV 應用程式
  const dwvAppRef = useRef(null);
  const dwvContainerRef = useRef(null);
  const [dwvInitialized, setDwvInitialized] = useState(false);
  
  // 初始化 DWV
  useEffect(() => {
    // 確保 DOM 元素存在
    if (!dwvContainerRef.current) return;
    
    try {
      // 創建 DWV 應用程式
      const app = new dwv.App();
      
      // 初始化應用程式
      app.init({
        "dataViewConfigs": {
          "*": [{
            "divId": "dwv-container"
          }]
        },
        "tools": {
          "WindowLevel": {},
          "ZoomAndPan": {},
          "Draw": {
            "options": ["Rectangle", "Circle", "Polygon"]
          }
        }
      });
      
      // 添加載入事件監聽器
      app.addEventListener('load', function () {
        console.log('DWV: Image loaded successfully');
      });
      
      app.addEventListener('error', function (error) {
        console.error('DWV error:', error);
      });
      
      // 保存應用程式引用
      dwvAppRef.current = app;
      setDwvInitialized(true);
    } catch (error) {
      console.error('Error initializing DWV:', error);
    }
    
    // 清理函數
    return () => {
      if (dwvAppRef.current) {
        try {
          dwvAppRef.current.reset();
        } catch (e) {
          console.error('Error resetting DWV app:', e);
        }
      }
    };
  }, []);
  
  // 當 dicomImage 變更時加載圖像
  useEffect(() => {
    const app = dwvAppRef.current;
    if (app && dwvInitialized && dicomImage && dicomImage.dicomData) {
      console.log('Loading DICOM data into DWV viewer');
      
      try {
        // 重置應用程式
        app.reset();
        
        // 使用 dwv 加載 DICOM 檔案
        app.loadURLs([dicomImage.dicomData.blobUrl]);
      } catch (error) {
        console.error('Error loading DICOM into DWV:', error);
      }
    }
  }, [dicomImage, dwvInitialized]);
  
  // 自定義繪製多邊形的事件處理器
  const handleMouseDown = (e) => {
    if (!isDrawing) return;
    
    // 獲取 Canvas 的位置
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
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
    } else {
      // 添加點到多邊形
      addPointToPolygon(x, y);
    }
  };
  
  return (
    <div className="canvas-container">
      {/* DWV 容器 */}
      <div 
        id="dwv-container" 
        ref={dwvContainerRef} 
        style={dwvStyle}
      ></div>
      
      {/* 繪圖層，用於自定義標記 */}
      <canvas 
        ref={drawingCanvasRef}
        className="drawing-canvas"
        onMouseDown={handleMouseDown}
      />
      
      {dwvInitialized && dwvAppRef.current && (
        <DrawingTools dwvApp={dwvAppRef.current} />
      )}
      
      {!dicomFile && (
        <div className="placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">×</div>
            <div>Dicom Image</div>
          </div>
        </div>
      )}
      
      {dicomFile && !dicomImage && (
        <div className="placeholder">
          <div className="placeholder-content">
            <div>Loading image...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCanvas;