import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, SelectLang, useIntl, ConnectProps, connect } from 'umi';
import React from 'react';
import { ConnectState } from '@/models/connect';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const {} = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>开发者中心</span>
              </Link>
            </div>
            <div className={styles.desc}> Developer Center -- 你所需要的都在这</div>
          </div>
          {children}
        </div>
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
