import React from 'react';
import './ContextMenu.css';

const ContextMenu = ({
  x,
  y,
  onAddRelation,
  onEdit,
  onDelete,
  onViewInfo,
  onClose,
}) => {
  return (
    <div
      className="context-menu"
      style={{ top: y, left: x }}
      onMouseLeave={onClose}
    >
      <ul>
        <li onClick={() => onAddRelation('배우자')}>배우자 추가</li>
        <li onClick={() => onAddRelation('아버지')}>아버지 추가</li>
        <li onClick={() => onAddRelation('어머니')}>어머니 추가</li>
        <li onClick={() => onAddRelation('자식')}>자식 추가</li>
        <li onClick={onEdit}>수정</li>
        <li onClick={onViewInfo}>정보 보기</li>
        <li onClick={onDelete}>삭제</li>
        <li onClick={onClose}>닫기</li>
      </ul>
    </div>
  );
};

export default ContextMenu;
