import { Col, Descriptions, PageHeader, Row, Statistic, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import React, { ReactElement } from 'react';

interface ClientPageHeaderProps {
  data: any;
  footer: ReactElement;
}

const ClientPageHeader = ({
  data,
  footer
}: ClientPageHeaderProps): ReactElement => {
  const routess = [
    { key: '1', path: '', breadcrumbName: '货代用户' },
    { key: '2', path: '', breadcrumbName: data.company }
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
      title={data.company}
      tags={
        <Tag color={data.active ? 'blue' : 'default'}>
          {data.active ? '启用' : '停用'}
        </Tag>
      }
      avatar={{ src: data.avatar }}
      breadcrumb={{ itemRender, routes: routess }}
      footer={footer}
    >
      <Row>
        <Col span={18}>
          <Descriptions size="small" column={2}>
            <Descriptions.Item label="联系人">{`${data.lastname}${data.firstname}`}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{data.email}</Descriptions.Item>
            <Descriptions.Item label="更新日期">{data.date}</Descriptions.Item>
            <Descriptions.Item label="手机">{`+${data.countryCode} ${data.phone}`}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={6}>
          <Statistic
            style={{
              border: '2px solid rgb(220 220 220)',
              textAlign: 'center'
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
