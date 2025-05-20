# DICOM Viewer 應用

這是一個使用 React 開發的 DICOM 檢視器應用程式，可以上傳、顯示 DICOM 醫療影像，並提供標記工具功能。

## 功能特點

### 上傳 DICOM 檔案
- 提供上傳按鈕，允許使用者選擇 DICOM (.dcm) 格式的醫療影像檔案
- 支援標準 DICOM 檔案格式

### DICOM 資料展示
- 解析並顯示病患資料
  - Patient Name（病患姓名）
  - Birthdate（出生日期）
  - Age（年齡）
  - Sex（性別）

### 影像呈現
- 使用 DWV (DICOM Web Viewer) 庫顯示 DICOM 醫療影像
- 支援標準 DICOM 影像格式

### 標記工具
- 提供多邊形標記功能
- 點擊 "Add" 按鈕啟動繪圖模式
- 支援在影像上繪製任意形狀的多邊形標記
- 實時預覽繪製中的多邊形

### 標記管理
- 顯示已創建的標記列表
- 每個標記提供編輯和刪除功能
- 可以調整現有標記的形狀

## 技術架構

### 前端框架
- React.js

### 核心依賴
- **react**: ^18.2.0 - 前端 UI 框架
- **react-dom**: ^18.2.0 - React DOM 操作
- **react-scripts**: 5.0.1 - Create React App 腳本
- **dicom-parser**: ^1.8.21 - 用於解析 DICOM 檔案
- **dwv**: ^0.34.2 - DICOM Web Viewer 庫，用於顯示醫療影像
- **lucide-react**: ^0.263.1 - 提供 UI 圖示
- **@testing-library/jest-dom**: ^5.17.0 - DOM 測試工具
- **@testing-library/react**: ^13.4.0 - React 測試工具
- **@testing-library/user-event**: ^13.5.0 - 使用者事件測試工具
- **web-vitals**: ^2.1.4 - 網頁效能分析工具

### 專案結構
```
src/
├── components/
│   ├── DicomViewer.js    # 主要視圖組件
│   ├── DrawingTools.js   # 繪圖工具操作
│   ├── ImageCanvas.js    # 影像顯示與標記畫布
│   ├── LabelList.js      # 標記列表
│   ├── LabelTools.js     # 標記工具面板
│   ├── PatientInfo.js    # 病患資訊顯示
│   └── UploadButton.js   # 檔案上傳按鈕
├── context/
│   └── DicomContext.js   # 全局狀態管理
├── utils/
│   ├── dicomParser.js    # DICOM 檔案解析
│   └── drawingUtils.js   # 繪圖輔助功能
├── App.css               # 全局樣式
└── App.js                # 應用入口
```

## 安裝與運行

### 前置需求
- Node.js (建議 14.x 或更高版本)
- npm 或 yarn

### 安裝依賴
```bash
npm install
```
或使用 yarn：
```bash
yarn install
```

### 啟動開發伺服器
```bash
npm start
```
或使用 yarn：
```bash
yarn start
```

### 建立生產版本
```bash
npm run build
```
或使用 yarn：
```bash
yarn build
```

## 使用指南

1. 點擊 "Upload" 按鈕選擇 DICOM (.dcm) 檔案
2. 上傳後，應用將顯示病患資訊和醫療影像
3. 點擊右側 "Add" 按鈕啟動標記模式
4. 在影像上點擊創建多邊形的各個點，點擊接近起始點位置來閉合多邊形
5. 在標記列表中使用編輯或刪除按鈕管理標記

## 限制與注意事項

- 僅支援標準 DICOM 檔案格式
- 顯示效能可能受到大型 DICOM 檔案的影響
- 建議使用現代瀏覽器 (Chrome, Firefox, Edge) 以獲得最佳體驗

## 未來功能規劃

- 多標記顏色支持
- 標記命名功能
- 標記量測功能
- 視圖控制優化
- 標記數據的儲存與導出

