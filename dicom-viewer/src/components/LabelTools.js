// src/components/LabelTools.js
import React, { useContext } from 'react';
import { DicomContext } from '../context/DicomContext';

const LabelTools = () => {
  const { dicomFile, addLabel, isDrawing, setIsDrawing } = useContext(DicomContext);
  
  const handleAddLabel = () => {
    // 切換到繪圖模式
    setIsDrawing(true);
    // 初始化新標記
    addLabel();
  };
  
  return (
    <div className="label-tools">
      <h2>Label Tools</h2>
      <button
        onClick={handleAddLabel}
        className="add-button"
        disabled={!dicomFile || isDrawing}
        style={{
          backgroundColor: isDrawing ? '#aaa' : '#3B82F6'
        }}
      >
        {isDrawing ? 'Drawing Mode Active' : 'Add'}
      </button>
    </div>
  );
};

export default LabelTools;