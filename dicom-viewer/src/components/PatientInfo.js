// src/components/PatientInfo.js
import React, { useContext } from 'react';
import { DicomContext } from '../context/DicomContext';

const PatientInfo = () => {
  const { patientInfo } = useContext(DicomContext);
  
  // 輸出更多日誌以診斷問題
  console.log('PatientInfo component rendering with:', patientInfo);
  
  return (
    <div className="patient-info">
      <p><strong>Patient Name:</strong> {patientInfo?.name || 'Unknown'}</p>
      <p><strong>Birthdate:</strong> {patientInfo?.birthdate || 'Unknown'}</p>
      <p><strong>Age:</strong> {patientInfo?.age || 'Unknown'}</p>
      <p><strong>Sex:</strong> {patientInfo?.sex || 'Unknown'}</p>
    </div>
  );
};

export default PatientInfo;