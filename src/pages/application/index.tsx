import { 
  PlusOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Button, Card, List, Typography, Divider, Modal, Form, Input, Select, Dropdown, Tooltip, Menu } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import { StateType } from './model';
import { AppItemDataType } from './data.d';
import styles from './style.less';

import ApplicationAdvancedSearch from './components/AdvanceSearchForm';
// import FormFormInModal from './components/ProductFormInModal';



interface ProductValues extends AppItemDataType {
  modifier: string;
}

interface ProductCreateFormProps {
  visible: boolean;
  confirmLoading: boolean;
  onCreate: (values: ProductValues) => void;
  onCancel: () => void;
}

const ProductCreateForm: React.FC<ProductCreateFormProps> = ({
  visible,
  confirmLoading,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="新增产品"
      okText="创建"
      cancelText="取消"
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        name="form_in_modal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{  }}
      >
        <Form.Item
          name="code"
          label="产品Code"
          rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
        >
          <Input placeholder="请输入产品的唯一Code" />
        </Form.Item>
        <Form.Item name="title" label="产品名称" > 
          <Input placeholder="请输入产品名称" />
        </Form.Item>
        <Form.Item name="logo" label="产品图标">
          <Input />
        </Form.Item>
        <Form.Item name="appDesc" label="产品描述">
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} placeholder="这里输入产品的详细描述" />
        </Form.Item>
        <Form.Item name="appType" label="产品线">
          <Select defaultValue="Option1-1">
            <Select.Option value="Option1-1">零售</Select.Option>
            <Select.Option value="Option1-2">批发</Select.Option>
            <Select.Option value="Option1-2">物流</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};


const { Paragraph } = Typography;
interface ListCardListProps {
  application: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface ListCardListState {
  visible: boolean;
  confirmLoading: boolean;
  // done: boolean;
  // current?: Partial<CardListItemDataType>;
}



class ListCardList extends Component<ListCardListProps, ListCardListState> {

  constructor(props: any) {
    super(props);

    this.state = {
      visible: false,
      confirmLoading : false,

    };
  }

  componentDidMount() {


  }

  toSearch = (fieldsValue: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'application/fetch',
      payload: {
        count: 8,
        ...fieldsValue,
      },
    });
  };

  onCreateProduct = (values : ProductValues) => {
    
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  }

  render() {
    const {
      application: { list },
      loading,
    } = this.props;

    const {
      visible,
      confirmLoading
    } = this.state;


    const content = (
      <div className={styles.pageHeaderContent}>
        <p>业务中台统一配置中心</p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
            快速开始
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
            产品简介
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
            产品文档
          </a>
        </div>
      </div>
    );
    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );
    const nullData: Partial<AppItemDataType> = {};
    return (
      <PageHeaderWrapper content={content} extraContent={extraContent}>
        <ApplicationAdvancedSearch onFinish={this.toSearch} />
        <Divider>产品列表</Divider>
        <div className={styles.cardList}>
          <List<Partial<AppItemDataType>>
            rowKey="id"
            loading={loading}
            grid={{
              gutter: 24,
              lg: 3,
              md: 2,
              sm: 1,
              xs: 1,
            }}
            dataSource={[nullData, ...list]}
            renderItem={item => {
              if (item && item.code) {
                return (
                  <List.Item key={item.code}>
                    <Card
                      hoverable
                      className={styles.card}
                      actions={[
                        <Tooltip key="download" title="下载">
                          <Button type="link" icon={<DownloadOutlined />} />
                        </Tooltip>,
                        <Tooltip key="edit" title="配置">
                          <Button type="link" icon={<EditOutlined />} />
                        </Tooltip>,
                        <Tooltip title="分享" key="share">
                          <Button type="link" icon={<ShareAltOutlined />} />
                        </Tooltip>,
                        <Dropdown key="ellipsis" overlay={
                          <Menu>
                            <Menu.Item>
                              <a target="_blank" rel="noopener noreferrer" href="https://www.alipay.com/">
                                操作一
                              </a>
                            </Menu.Item>
                            <Menu.Item>
                              <a target="_blank" rel="noopener noreferrer" href="https://www.taobao.com/">
                                操作二
                              </a>
                            </Menu.Item>
                            <Menu.Item>
                              <a target="_blank" rel="noopener noreferrer" href="https://www.tmall.com/">
                                操作三
                              </a>
                            </Menu.Item>
                          </Menu>
                        }>
                          <Button type="link" icon={<EllipsisOutlined />} />
                        </Dropdown>,
                      ]}
                    >
                      <Card.Meta
                        avatar={<img alt="" className={styles.cardAvatar} src={item.logo} />}
                        title={<a>{item.title}</a>}
                        description={
                          <Paragraph
                            className={styles.item}
                            ellipsis={{
                              rows: 3,
                            }}
                          >
                            {item.description}
                          </Paragraph>
                        }
                      />
                    </Card>
                  </List.Item>
                );
              }

              return (
                <List.Item>
                  <Button 
                    type="dashed" 
                    className={styles.newButton} 
                    onClick={() => {
                      this.setState( {
                        visible : true,
                      });
                    }}
                  >
                    <PlusOutlined /> 新增产品
                  </Button>
                </List.Item>
              );
            }}
          />
        </div>

        <ProductCreateForm 
          visible={visible}
          confirmLoading={confirmLoading}
          onCreate={this.onCreateProduct}
          onCancel={() => {
            this.setState( {
              visible : false,
            });
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    application,
    loading,
  }: {
    application: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    application,
    loading: loading.models.application,
  })
)(ListCardList);
