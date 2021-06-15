import React, { ReactElement } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import ProfilePage from '../../ProfilePage';
import InfoPanel from '../components/InfoPanel/InfoPanel';
import PasswordPanel from '../../PasswordPanel';
import { PasswordFormValue, UpdateUserSelf } from '../../../shared/types/user';
import {
  selectCurUser,
  updateProfileHandler,
  updateSelfPasswordHandler
} from '../../../redux/user/userSlice';

const UserProfile = (): ReactElement => {
  const dispatch = useDispatch();
  const curUser = useSelector(selectCurUser);

  const infoPanelDataHandler = async (id: string, values: UpdateUserSelf) => {
    dispatch(updateProfileHandler(id, values));
  };

  const passwordPanelDataHandler = async (values: PasswordFormValue) => {
    dispatch(updateSelfPasswordHandler(values));
  };

  return (
    <ProfilePage
      panels={[
        <InfoPanel data={curUser!} onSubmit={infoPanelDataHandler} />,
        <PasswordPanel isSelf onSumbit={passwordPanelDataHandler} />
      ]}
    />
  );
};

export default UserProfile;
