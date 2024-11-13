import React from 'react';
import './PersonBox.css';

const formatDate = (dateString) => {
  if (!dateString || dateString === '0000-00-00') {
    return '0000-00-00';
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '0000-00-00';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const PersonBox = ({ name, birthdate, gender, isMain }) => {
  return (
    <div className={`person-box ${gender} ${isMain ? 'main' : ''}`}>
      <h2>{name}</h2>
      <p>{formatDate(birthdate)}</p>
    </div>
  );
};

export default PersonBox;
