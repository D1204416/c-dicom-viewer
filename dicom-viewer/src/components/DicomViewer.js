// src/components/DicomViewer.js
import React from 'react';
import UploadButton from './UploadButton';
import PatientInfo from './PatientInfo';
import ImageCanvas from './ImageCanvas';
import LabelTools from './LabelTools';
import LabelList from './LabelList';

const DicomViewer = () => {
  return (
    <div className="app-container">
      <div className="header">
        <h1>DICOM Viewer</h1>
      </div>
      
      <div className="main-content">
        <div className="left-panel">
          <UploadButton />
          <PatientInfo />
          <ImageCanvas />
        </div>
        
        <div className="right-panel">
          <LabelTools />
          <LabelList />
        </div>
      </div>
    </div>
  );
};

export default DicomViewer;