import React from 'react';
import { Form, Input, Modal, } from 'antd';
import { RuleProColumns } from '@/typings.d';
import { Dictionary } from '../data';

interface DictFormProps {
  modalVisible: boolean;
  onSubmit: (fields: Dictionary) => void;
  onCancel: () => void;
  values: Partial<Dictionary> & { create : boolean};
  columns: RuleProColumns[];
}

const DictForm: React.FC<DictFormProps> = props => {
 
  const [form] = Form.useForm();

  const { modalVisible, onSubmit, onCancel, values, columns } = props;

  return (
    <Modal
      destroyOnClose
      title={values.create ?  '新建字典' : '修改字典'}
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={() => {
        form.validateFields().then(values => {
          const data = form.getFieldsValue();
          const json = JSON.parse(data.value);
          Object.assign(data,{ value: json});
          onSubmit(data);
        }).catch(errorInfo => {
          
        });
      }}
    >
      <Form
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        form={form}
        initialValues={{
          ...values,
          value : JSON.stringify(values.value),
        }}
      >
        {
          columns.filter(column => {
            return !column.hideInForm && column.dataIndex
          }).map( column => {
            return (
              <Form.Item name={column.dataIndex} label={column.title} rules={column.rules}>
                <Input />
              </Form.Item>
            );
          })
        }
        <Form.Item name="value" label="字典值" rules={[
            {
              required: true,
              message: '内容非 JSON 格式',
              validator : (rule, value, callback) => {
                try{
                  JSON.parse(value);
                  return Promise.resolve();
                } catch (e) {
                  return Promise.reject(e);
                }
              }
            },
          ]}>
          <Input.TextArea rows={8} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DictForm;
