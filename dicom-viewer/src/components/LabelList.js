// src/components/LabelList.js
import React, { useContext } from 'react';
import { DicomContext } from '../context/DicomContext';
import { Pencil, Trash2 } from 'lucide-react';

const LabelList = () => {
  const { labels, editLabel, deleteLabel } = useContext(DicomContext);
  
  return (
    <div className="label-list">
      <h2>Label List</h2>
      {labels.length === 0 ? (
        <p className="no-labels">No labels yet</p>
      ) : (
        <ul className="labels-ul">
          {labels.map((label, index) => (
            <li key={label.id} className="label-item">
              <span className="label-name">
                <span className="label-color"></span>
                Label {index + 1}
              </span>
              <div className="label-actions">
                <button
                  onClick={() => editLabel(label.id)}
                  className="edit-button"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteLabel(label.id)}
                  className="delete-button"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LabelList;