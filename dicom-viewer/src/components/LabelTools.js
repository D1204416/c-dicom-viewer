// src/components/LabelTools.js
import React, { useContext } from 'react';
import { DicomContext } from '../context/DicomContext';

const LabelTools = () => {
  const { dicomFile, addLabel } = useContext(DicomContext);
  
  return (
    <div className="label-tools">
      <h2>Label Tools</h2>
      <button
        onClick={addLabel}
        className="add-button"
        disabled={!dicomFile}
      >
        Add
      </button>
    </div>
  );
};

export default LabelTools;