import { Button } from 'antd';
import React from 'react';
import { CSVLink } from 'react-csv';

interface DownloadCSEButtonProps {
  label: string;
  data: any;
  fileName: string;
}

const DownloadCSVButton = ({
  label,
  data,
  fileName
}: DownloadCSEButtonProps) => {
  return (
    <Button type="primary" disabled={!data || data.length === 0}>
      <CSVLink data={data} filename={`${fileName}.csv`}>
        {label}
      </CSVLink>
    </Button>
  );
};

export default DownloadCSVButton;
