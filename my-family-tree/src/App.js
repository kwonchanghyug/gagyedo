import React, { useState } from 'react';
import PersonBox from './components/PersonBox';
import ContextMenu from './components/ContextMenu';
import './App.css';

function App() {
  const [family, setFamily] = useState([
    {
      id: 'M19900101-001',
      name: '홍길동',
      birthdate: '1990-01-01',
      gender: 'male',
      relation: '기본',
      memo: '',
    },
  ]);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    targetId: null,
  });

  const generateId = (gender, birthdate) => {
    const prefix = gender === 'male' ? 'M' : 'W';
    const datePart = birthdate.replace(/-/g, '');
    const count =
      family.filter(
        (member) => member.gender === gender && member.birthdate === birthdate
      ).length + 1;
    const countPart = String(count).padStart(3, '0');
    return `${prefix}${datePart}-${countPart}`;
  };

  const addRelation = (relation) => {
    const targetIndex = family.findIndex((m) => m.id === contextMenu.targetId);
    const target = family[targetIndex];
    let gender = null;

    if (relation === '배우자') {
      gender = target.gender === 'male' ? 'female' : 'male';
    } else if (relation === '아버지') {
      gender = 'male';
    } else if (relation === '어머니') {
      gender = 'female';
    } else if (relation === '자식') {
      gender =
        prompt('자식의 성별을 입력하세요 (남/여):') === '남'
          ? 'male'
          : 'female';
    }

    const newName = prompt(`${relation}의 이름을 입력하세요:`) || '무명';
    const newBirthdate = prompt(
      `${relation}의 생년월일을 입력하세요 (YYYY-MM-DD):`
    );
    const birthdate = newBirthdate ? newBirthdate : '0000-00-00';

    const newMember = {
      id: generateId(gender, birthdate),
      name: newName,
      birthdate: birthdate,
      gender: gender,
      relation: relation,
      memo: '',
    };

    const updatedFamily = [...family];

    if (relation === '배우자') {
      if (target.gender === 'male') {
        updatedFamily.splice(targetIndex + 1, 0, newMember);
      } else if (target.gender === 'female') {
        updatedFamily.splice(targetIndex, 0, newMember);
      }
    } else if (relation === '아버지' || relation === '어머니') {
      updatedFamily.unshift(newMember);
    } else if (relation === '자식') {
      updatedFamily.push(newMember);
    }

    setFamily(updatedFamily);
    closeContextMenu();
  };

  const editMember = () => {
    const member = family.find((m) => m.id === contextMenu.targetId);
    if (member) {
      const updatedName = prompt('이름을 수정하세요:', member.name) || '무명';
      const updatedBirthdate = prompt(
        '생년월일을 수정하세요 (YYYY-MM-DD):',
        member.birthdate
      );
      const birthdate = updatedBirthdate ? updatedBirthdate : '0000-00-00';
      const updatedMemo = prompt('메모를 수정하세요:', member.memo) || '';

      let updatedGender = member.gender;

      if (member.id === 'M19900101-001') {
        // 기본 인물만 성별 수정 가능
        const genderInput = prompt(
          '성별을 수정하세요 (남/여):',
          member.gender === 'male' ? '남' : '여'
        );
        if (genderInput === '남') {
          updatedGender = 'male';
        } else if (genderInput === '여') {
          updatedGender = 'female';
        } else {
          alert('올바른 성별을 입력하세요 (남/여).');
          return;
        }
      }

      setFamily(
        family.map((m) =>
          m.id === member.id
            ? {
                ...m,
                name: updatedName,
                birthdate: birthdate,
                gender: updatedGender,
                memo: updatedMemo,
              }
            : m
        )
      );
    }
    closeContextMenu();
  };

  const viewInfo = () => {
    const member = family.find((m) => m.id === contextMenu.targetId);
    if (member) {
      alert(
        `ID: ${member.id}\n이름: ${member.name}\n생년월일: ${member.birthdate}\n메모: ${member.memo}`
      );
    }
    closeContextMenu();
  };

  const deleteMember = () => {
    if (contextMenu.targetId !== 'M19900101-001') {
      // 기본 인물은 삭제 불가
      setFamily(family.filter((m) => m.id !== contextMenu.targetId));
    } else {
      alert('기본 인물은 삭제할 수 없습니다.');
    }
    closeContextMenu();
  };

  const handleContextMenu = (event, id) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      targetId: id,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, targetId: null });
  };

  const parents = family.filter(
    (member) => member.relation === '아버지' || member.relation === '어머니'
  );
  const children = family.filter((member) => member.relation === '자식');
  const others = family.filter(
    (member) =>
      member.relation !== '아버지' &&
      member.relation !== '어머니' &&
      member.relation !== '자식'
  );

  return (
    <div className="App">
      <h1>가계도</h1>
      <div className="family-tree">
        <div className="parents">
          {parents.map((member) => (
            <div
              key={member.id}
              className="person-container"
              onContextMenu={(e) => handleContextMenu(e, member.id)}
            >
              <PersonBox
                name={member.name}
                birthdate={member.birthdate}
                gender={member.gender}
                isMain={member.relation === '기본'}
              />
            </div>
          ))}
        </div>
        {parents.length > 0 && <div className="vertical-connector"></div>}
        <div className="others">
          {others.map((member, index) => (
            <div
              key={member.id}
              className="person-container"
              onContextMenu={(e) => handleContextMenu(e, member.id)}
            >
              <PersonBox
                name={member.name}
                birthdate={member.birthdate}
                gender={member.gender}
                isMain={member.relation === '기본'}
              />
              {index < others.length - 1 && <div className="connector"></div>}
            </div>
          ))}
        </div>
        {children.length > 0 && <div className="vertical-connector"></div>}
        <div className="children">
          {children.map((member) => (
            <div
              key={member.id}
              className="person-container"
              onContextMenu={(e) => handleContextMenu(e, member.id)}
            >
              <PersonBox
                name={member.name}
                birthdate={member.birthdate}
                gender={member.gender}
                isMain={member.relation === '기본'}
              />
            </div>
          ))}
        </div>
      </div>
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAddRelation={addRelation}
          onEdit={editMember}
          onDelete={deleteMember}
          onViewInfo={viewInfo}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
}

export default App;
