import { notification } from 'antd';
import { Dispatch } from '@reduxjs/toolkit';
import { logoutUserHandler } from '../../redux/user/userSlice';
import { ResponseError } from '../types';

const errorHandler = (error: ResponseError, dispatch: Dispatch): void => {
  const { response } = error;
  if (response && response.status) {
    // let errorText =
    //   HTTP_ERROR_CODE_MESSAGE[response.status] || response.statusText;
    const { status } = response;

    if (
      response.data &&
      response.data.error &&
      response.data.error.message &&
      response.data.error.message.code
    ) {
      console.log({
        message: `请求错误 ${status}`,
        description: response.data.error.message
      });
      if (response.data.error.message.code === 11000) {
        // errorText = `${
        //   Object.values(response.data.error.message.keyValue)[0]
        // } 已存在！`;
      }
    }

    if (status === 401) {
      dispatch(logoutUserHandler());
      return;
    }
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常'
    });
  }
};

export default errorHandler;
