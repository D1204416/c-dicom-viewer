// src/components/UploadButton.js
import React, { useContext } from 'react';
import { DicomContext } from '../context/DicomContext';
import { parseDicomFile } from '../utils/dicomParser';

const UploadButton = () => {
  const { setDicomFile, setPatientInfo, setDicomImage } = useContext(DicomContext);
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('File selected:', file.name, file.size);
    setDicomFile(file);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        console.log('File loaded, parsing DICOM...');
        // 解析 DICOM 文件
        const result = await parseDicomFile(e.target.result);
        
        console.log('DICOM parsing result:', {
          hasPatientInfo: !!result.patientInfo,
          patientName: result.patientInfo?.name,
          hasDicomData: !!result.dicomData
        });
        
        // 設置病患資訊
        if (result && result.patientInfo) {
          setPatientInfo(result.patientInfo);
        } else {
          setPatientInfo({
            name: 'Unknown',
            birthdate: 'Unknown',
            age: 'Unknown',
            sex: 'Unknown'
          });
        }
        
        // 設置 DICOM 資料
        if (result && result.dicomData) {
          setDicomImage({
            dicomData: result.dicomData
          });
        } else {
          console.warn('No image data found in DICOM file');
          setDicomImage(null);
        }
      } catch (error) {
        console.error('Error parsing DICOM file:', error);
        alert('Error parsing DICOM file. Please try another file.');
        
        // 設置預設值
        setPatientInfo({
          name: 'Unknown',
          birthdate: 'Unknown',
          age: 'Unknown',
          sex: 'Unknown'
        });
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading file.');
    };
    
    reader.readAsArrayBuffer(file);
  };
  
  return (
    <div className="upload-container">
      <label className="upload-button">
        <input
          type="file"
          accept=".dcm"
          onChange={handleFileUpload}
        />
        Upload
      </label>
    </div>
  );
};

export default UploadButton;