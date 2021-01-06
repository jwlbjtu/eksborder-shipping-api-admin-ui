import { Col, Descriptions, PageHeader, Row, Statistic, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import React, { ReactElement } from 'react';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { User } from '../../../shared/types/user';
import { DEFAULT_SERVER_HOST } from '../../../shared/utils/constants';

interface ClientPageHeaderProps {
  data: User;
  footer: ReactElement;
}

const ClientPageHeader = ({
  data,
  footer
}: ClientPageHeaderProps): ReactElement => {
  const breadcrumbEles = [
    { key: '1', path: '', breadcrumbName: '货代用户' },
    { key: '2', path: '', breadcrumbName: data.companyName }
  ];

  const itemRender = (
    route: Route,
    params: any[],
    routes: Route[],
    paths: string[]
  ) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? (
      <span key={route.breadcrumbName}>{route.breadcrumbName}</span>
    ) : (
      <Link key={route.breadcrumbName} to="/clients">
        {route.breadcrumbName}
      </Link>
    );
  };

  return (
    <PageHeader
      title={data.companyName}
      tags={
        <Tag color={data.isActive ? 'blue' : 'default'}>
          {data.isActive ? '启用' : '停用'}
        </Tag>
      }
      avatar={{
        src: data.logoImage && `${DEFAULT_SERVER_HOST}/${data.logoImage}`,
        icon: <UserOutlined />
      }}
      breadcrumb={{ itemRender, routes: breadcrumbEles }}
      footer={footer}
    >
      <Row>
        <Col span={18}>
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="联系人">{`${data.lastName}${data.firstName}`}</Descriptions.Item>
            <Descriptions.Item label="最低额度">
              ${data.minBalance.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="更新日期">
              {dayjs(data.updatedAt).format('YYYY/MM/DD')}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">{data.email}</Descriptions.Item>
            <Descriptions.Item label="手机">{`+${data.countryCode} ${data.phone}`}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={6}>
          <Statistic
            style={{
              border: '2px solid rgb(220 220 220)',
              textAlign: 'center'
            }}
            valueStyle={{
              color: data.balance > data.minBalance ? 'black' : '#cf1322'
            }}
            title="账户余额"
            precision={2}
            prefix="$"
            value={data.balance}
          />
        </Col>
      </Row>
    </PageHeader>
  );
};

export default ClientPageHeader;
