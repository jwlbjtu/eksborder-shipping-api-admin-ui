import { Button, Result } from 'antd';
import React, { ReactElement } from 'react';

interface LoadErrorProp {
  title?: string;
  subTitle?: string;
  text?: string;
  onButtonClick?: () => void;
}

const LoadError = ({
  title,
  subTitle,
  text,
  onButtonClick
}: LoadErrorProp): ReactElement => {
  return (
    <Result
      status="error"
      title={title}
      subTitle={subTitle}
      extra={
        <Button type="primary" onClick={onButtonClick}>
          {text}
        </Button>
      }
    />
  );
};

LoadError.defaultProps = {
  title: '',
  subTitle: '',
  text: '',
  onButtonClick: undefined
};

export default LoadError;
