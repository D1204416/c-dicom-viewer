// src/context/DicomContext.js (更新 dicomImage 類型)
import React, { createContext, useState, useRef } from 'react';

export const DicomContext = createContext();

export const DicomProvider = ({ children }) => {
  const [dicomFile, setDicomFile] = useState(null);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    birthdate: '',
    age: '',
    sex: ''
  });
  // 包含 dicomData 的新結構
  const [dicomImage, setDicomImage] = useState(null);
  const [labels, setLabels] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState(null);
  
  // References
  const canvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const polygonPointsRef = useRef([]);
  
  // 添加標記
  const addLabel = () => {
    setIsDrawing(true);
    polygonPointsRef.current = [];
    setEditingLabelId(null);
  };
  
  // 編輯標記
  const editLabel = (id) => {
    const labelToEdit = labels.find(label => label.id === id);
    if (labelToEdit) {
      polygonPointsRef.current = [...labelToEdit.points];
      setIsDrawing(true);
      setEditingLabelId(id);
    }
  };
  
  // 刪除標記
  const deleteLabel = (id) => {
    setLabels(labels.filter(label => label.id !== id));
  };
  
  // 完成多邊形繪製
  const completePolygon = () => {
    const points = polygonPointsRef.current;
    
    if (editingLabelId !== null) {
      // 更新現有標記
      setLabels(labels.map(label => 
        label.id === editingLabelId ? { ...label, points: [...points] } : label
      ));
    } else {
      // 添加新標記
      const newLabel = {
        id: Date.now(),
        points: [...points],
        color: '#3B82F6'
      };
      setLabels([...labels, newLabel]);
    }
    
    // 重置狀態
    setIsDrawing(false);
    polygonPointsRef.current = [];
    setEditingLabelId(null);
  };
  
  // 添加點到當前多邊形
  const addPointToPolygon = (x, y) => {
    polygonPointsRef.current.push({ x, y });
  };
  
  return (
    <DicomContext.Provider
      value={{
        dicomFile,
        setDicomFile,
        patientInfo,
        setPatientInfo,
        dicomImage,
        setDicomImage,
        labels,
        setLabels,
        isDrawing,
        setIsDrawing,
        editingLabelId,
        setEditingLabelId,
        canvasRef,
        drawingCanvasRef,
        polygonPointsRef,
        addLabel,
        editLabel,
        deleteLabel,
        completePolygon,
        addPointToPolygon
      }}
    >
      {children}
    </DicomContext.Provider>
  );
};