// src/utils/dicomParser.js
import * as dwv from 'dwv';
import * as dicomParser from 'dicom-parser'; // 引入原始的 dicom-parser 庫

// 初始化 DWV（僅用於顯示影像）
if (typeof dwv.utils === 'undefined') {
  dwv.utils = {};
}
if (typeof dwv.utils.decodeQuery === 'undefined') {
  dwv.utils.decodeQuery = function() { return {}; };
}

// 輔助函數：計算年齡
function calculateAge(birthDateString) {
  // 檢查格式是否為 YYYYMMDD
  if (!birthDateString || birthDateString === 'Unknown' || birthDateString.length !== 8) {
    return 'Unknown';
  }
  
  try {
    // 從 YYYYMMDD 格式解析生日
    const year = parseInt(birthDateString.slice(0, 4), 10);
    const month = parseInt(birthDateString.slice(4, 6), 10) - 1; // 月份從 0 開始
    const day = parseInt(birthDateString.slice(6, 8), 10);
    
    const birthDate = new Date(year, month, day);
    const today = new Date();
    
    // 檢查日期是否有效
    if (isNaN(birthDate.getTime())) {
      return 'Unknown';
    }
    
    // 計算年齡
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // 如果還沒到生日，年齡減一
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age + 'Y'; // 添加 "Y" 表示年（符合 DICOM 格式）
  } catch (e) {
    console.error('Error calculating age:', e);
    return 'Unknown';
  }
}

// 輔助函數：格式化日期
function formatDate(dicomDateString) {
  // 檢查格式是否為 YYYYMMDD
  if (!dicomDateString || dicomDateString === 'Unknown' || dicomDateString.length !== 8) {
    return dicomDateString || 'Unknown';
  }
  
  try {
    // 從 YYYYMMDD 格式轉換為 YYYY-MM-DD
    return `${dicomDateString.slice(0, 4)}-${dicomDateString.slice(4, 6)}-${dicomDateString.slice(6, 8)}`;
  } catch (e) {
    console.error('Error formatting date:', e);
    return dicomDateString || 'Unknown';
  }
}

export const parseDicomFile = async (arrayBuffer) => {
  try {
    // 解析 DICOM 檔案
    const fileData = new Uint8Array(arrayBuffer);
    
    // 創建一個 Blob 對象
    const blob = new Blob([fileData], {type: 'application/dicom'});
    const blobUrl = URL.createObjectURL(blob);
    
    // 使用 dicom-parser 直接解析 DICOM 標籤
    let patientInfo = {
      name: 'Unknown',
      birthdate: 'Unknown',
      age: 'Unknown',
      sex: 'Unknown'
    };
    
    try {
      // 使用 dicom-parser 直接解析 DICOM 資料
      const dataSet = dicomParser.parseDicom(fileData);
      
      // 讀取患者姓名 (0010,0010)
      if (dataSet.elements.x00100010) {
        patientInfo.name = dataSet.string('x00100010') || 'Unknown';
      }
      
      // 讀取原始出生日期 (0010,0030)
      let rawBirthdate = 'Unknown';
      if (dataSet.elements.x00100030) {
        rawBirthdate = dataSet.string('x00100030') || 'Unknown';
      }
      
      // 格式化出生日期
      patientInfo.birthdate = formatDate(rawBirthdate);
      
      // 嘗試從 DICOM 直接讀取年齡 (0010,1010)
      if (dataSet.elements.x00101010) {
        patientInfo.age = dataSet.string('x00101010') || 'Unknown';
      } else {
        // 如果 DICOM 中沒有年齡，則根據出生日期計算
        patientInfo.age = calculateAge(rawBirthdate);
      }
      
      // 讀取性別 (0010,0040)
      if (dataSet.elements.x00100040) {
        patientInfo.sex = dataSet.string('x00100040') || 'Unknown';
      }
      
      console.log('Patient info parsed with dicom-parser:', patientInfo);
    } catch (parseError) {
      console.error('Error parsing DICOM tags with dicom-parser:', parseError);
      // 使用默認的 patientInfo
    }
    
    // 提供 DICOM 原始資料和 Blob URL 以便在 ImageCanvas 組件中使用
    return {
      patientInfo,
      dicomData: {
        arrayBuffer,
        blobUrl
      }
    };
  } catch (error) {
    console.error('Error parsing DICOM file:', error);
    throw error;
  }
};