import { Table } from 'antd';
import React, { useState,  } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Resizable, ResizableBox } from 'react-resizable';
import ProCard from '@ant-design/pro-card';
import { ColumnsType } from 'antd/lib/table';
import './index.css';

const ResizableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};


const Index: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({ create: false });

  const handleResize = index => (e, { size }) => {
    console.log(size);
      // const nextColumns = [...cols];
      // nextColumns[index] = {
      //   ...nextColumns[index],
      //   width: size.width,
      // };
      // setCols(nextColumns);
  };

  return (
    <PageHeaderWrapper>
      <ProCard split="vertical">
        <ProCard title="新建工程" colSpan="50%">
          <Table
            // components={{
            //   header: {
            //     cell: ResizableTitle,
            //   },
            // }}
            columns={[
              {
                title: 
                  <ResizableBox width={200} 
                    >
                    <span>Contents</span>
                  </ResizableBox>,
                dataIndex: 'name',
                onHeaderCell : (colmun, index) => {
                  console.log(colmun);
                  return {
                    width :  colmun.width,
                  }
                }
              },
              {
                title: 'Chinese Score',
                dataIndex: 'chinese',
                sorter: {
                  compare: (a, b) => a.chinese - b.chinese,
                  multiple: 3,
                },
              },
              {
                title: 'Math Score',
                dataIndex: 'math',
                sorter: {
                  compare: (a, b) => a.math - b.math,
                  multiple: 2,
                },
              },
              {
                title: 'English Score',
                dataIndex: 'english',
                sorter: {
                  compare: (a, b) => a.english - b.english,
                  multiple: 1,
                },
              },
            ]}
            dataSource={[
              {
                key: '1',
                name: 'John Brown',
                chinese: 98,
                math: 60,
                english: 70,
              },
              {
                key: '2',
                name: 'Jim Green',
                chinese: 98,
                math: 66,
                english: 89,
              },
              {
                key: '3',
                name: 'Joe Black',
                chinese: 98,
                math: 90,
                english: 70,
              },
              {
                key: '4',
                name: 'Jim Red',
                chinese: 88,
                math: 99,
                english: 89,
              },
            ]}
          />
        </ProCard>
        <ProCard title="所需组件" headerBordered>
          <div style={{ height: 360 }}>右侧内容</div>
        </ProCard>
      </ProCard>
    </PageHeaderWrapper>
  );
};

export default Index;
