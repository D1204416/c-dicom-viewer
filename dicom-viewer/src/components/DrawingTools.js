// src/components/DrawingTools.js
import React, { useContext, useEffect } from 'react';
import { DicomContext } from '../context/DicomContext';

const DrawingTools = ({ dwvApp }) => {
  const { isDrawing, setIsDrawing } = useContext(DicomContext);
  
  // 處理工具改變
  const handleToolChange = (toolName) => {
    if (!dwvApp) return;
    
    dwvApp.setTool(toolName);
    
    if (toolName === 'Draw') {
      setIsDrawing(true);
    } else {
      setIsDrawing(false);
    }
  };
  
  // 處理繪圖形狀改變
  const handleShapeChange = (shapeName) => {
    if (!dwvApp) return;
    
    dwvApp.setDrawShape(shapeName);
  };
  
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