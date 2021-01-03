import { notification } from 'antd';
import { ResponseError } from '../types';
import { HTTP_ERROR_CODE_MESSAGE } from './constants';

const errorHandler = (error: ResponseError): void => {
  const { response } = error;
  if (response && response.status) {
    let errorText =
      HTTP_ERROR_CODE_MESSAGE[response.status] || response.statusText;
    const { status, url } = response;

    if (
      response.data &&
      response.data.error &&
      response.data.error.message &&
      response.data.error.message.code
    ) {
      if (response.data.error.message.code === 11000) {
        errorText = `${
          Object.values(response.data.error.message.keyValue)[0]
        } 已存在！`;
      }
    }

    notification.error({
      message: `请求错误 ${status}`,
      description: errorText
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常'
    });
  }
};

export default errorHandler;
