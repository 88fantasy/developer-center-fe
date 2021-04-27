import React from "react";

import { Form, Row, Col, Input, Button, Select } from "antd";

import styles from "./index.less";

const ApplicationAdvancedSearch = (props: { onFinish: any }) => {
  const [form] = Form.useForm();
  const { onFinish } = props;
  return (
    <Form
      form={form}
      name="advanced_search"
      className="ant-advanced-search-form"
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={8} key="code">
          <Form.Item name="appCode" label="产品Code">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8} key="name">
          <Form.Item name="appName" label="产品名称">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8} key="type">
          <Form.Item name="appType" label="产品线">
            <Select>
              <Select.Option value="Option1-1">零售</Select.Option>
              <Select.Option value="Option1-2">批发</Select.Option>
              <Select.Option value="Option1-2">物流</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col
          span={24}
          style={{
            textAlign: 'right',
          }}
        >
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button
            style={{
              marginLeft: 8,
            }}
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ( { onFinish } ) => (
  <div className={styles.container}>
    <div id="components-form-demo-advanced-search">
      <div>
        <ApplicationAdvancedSearch onFinish={onFinish} />
      </div>
    </div>
  </div>
);
