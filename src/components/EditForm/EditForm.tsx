import React from 'react';
import { Button, Drawer, Form, Input, Select } from 'antd';

import type { RuleProColumns } from '@//typings.d';

interface DictFormProps {
  width?: number | string;
  modalVisible: boolean;
  onSubmit: (fields: any) => void;
  onCancel: () => void;
  values: Partial<any>;
  columns: RuleProColumns[];
}

const DictForm: React.FC<DictFormProps> = (props) => {
  const [form] = Form.useForm();

  const { width = '50%', modalVisible, onSubmit, onCancel, values, columns } = props;

  form.setFieldsValue({
    ...values,
  });

  return (
    <Drawer
      width={width}
      destroyOnClose
      title={values.id ? '修改' : '新建'}
      visible={modalVisible}
      onClose={onCancel}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button
            type="primary"
            onClick={() => {
              const data = {
                ...values,
                ...form.getFieldsValue(),
              };
              onSubmit(data);
            }}
          >
            提交
          </Button>
        </div>
      }
    >
      <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} form={form} initialValues={{}}>
        {columns
          .filter((column) => {
            return !column.hideInForm && column.dataIndex;
          })
          .map((column) => {
            return (
              <Form.Item name={column.dataIndex} label={column.title} rules={column.rules}>
                <Input />
              </Form.Item>
            );
          })}
      </Form>
    </Drawer>
  );
};

export default DictForm;
