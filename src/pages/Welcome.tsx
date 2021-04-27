import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import styles from './Welcome.less';

const CodePreview: React.FC<{}> = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default (): React.ReactNode => (
  <PageContainer>
    <Card>
      <Typography.Text strong>
        欢迎来到开发者中心
      </Typography.Text>
      <CodePreview>yarn add  ant-design-exframework</CodePreview>
    </Card>
  </PageContainer>
);
