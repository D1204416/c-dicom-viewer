// src/components/DrawingTools.js
import React, { useContext, useEffect } from 'react';
import { DicomContext } from '../context/DicomContext';

const DrawingTools = ({ dwvApp }) => {
  const { isDrawing, setIsDrawing } = useContext(DicomContext);
  
  // 處理工具改變
  const handleToolChange = (toolName) => {
    if (!dwvApp) {
      console.error('DWV app is not initialized');
      return;
    }
    
    try {
      // 嘗試設置工具
      console.log('Setting tool to:', toolName);
      dwvApp.setTool(toolName);
      
      if (toolName === 'Draw') {
        setIsDrawing(true);
      } else {
        setIsDrawing(false);
      }
    } catch (e) {
      console.error('Error setting tool:', e);
    }
  };
  
  // 處理繪圖形狀改變
  const handleShapeChange = (shapeName) => {
    if (!dwvApp) {
      console.error('DWV app is not initialized');
      return;
    }
    
    try {
      // 檢查 API 方法
      if (typeof dwvApp.setDrawShape === 'function') {
        // 舊版 API
        dwvApp.setDrawShape(shapeName);
      } else if (dwvApp.tools && typeof dwvApp.tools.setDrawShape === 'function') {
        // 可能的替代 API 1
        dwvApp.tools.setDrawShape(shapeName);
      } else if (dwvApp.getDrawController && typeof dwvApp.getDrawController().setShape === 'function') {
        // 可能的替代 API 2
        dwvApp.getDrawController().setShape(shapeName);
      } else {
        // 嘗試從工具選項中設定
        console.log('Trying to set shape through tool options');
        dwvApp.setToolOption('Draw', 'shape', shapeName);
      }
      
      console.log('Shape set to:', shapeName);
    } catch (e) {
      console.error('Error setting shape:', e, 'Available methods:', Object.keys(dwvApp));
    }
  };
  
  // 打印 DWV 應用程式的方法以便調試
  useEffect(() => {
    if (dwvApp) {
      console.log('DWV app available methods:', Object.keys(dwvApp));
      if (dwvApp.tools) {
        console.log('DWV tools available methods:', Object.keys(dwvApp.tools));
      }
    }
  }, [dwvApp]);
  
  return (
    <div className="drawing-tools">
      <div className="tool-buttons">
        <button onClick={() => handleToolChange('WindowLevel')}>Window/Level</button>
        <button onClick={() => handleToolChange('ZoomAndPan')}>Zoom/Pan</button>
        <button onClick={() => handleToolChange('Draw')}>Draw</button>
      </div>
      
      {isDrawing && (
        <div className="shape-buttons">
          <button onClick={() => handleShapeChange('Rectangle')}>Rectangle</button>
          <button onClick={() => handleShapeChange('Circle')}>Circle</button>
          <button onClick={() => handleShapeChange('Polygon')}>Polygon</button>
        </div>
      )}
    </div>
  );
};

export default DrawingTools;