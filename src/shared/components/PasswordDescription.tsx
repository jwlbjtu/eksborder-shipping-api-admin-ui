import React from 'react';

const PasswordDescription = () => {
  return (
    <div>
      <ul>
        <li>8位字符以上</li>
        <li>大写字母、小写字母、数字</li>
        <li>{'特殊符号： -#!$%^&*()_+|~=`{}[]:";\'<>?,./'}</li>
      </ul>
    </div>
  );
};

export default PasswordDescription;
