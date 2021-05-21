export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            // wrappers: ['@/wrappers/Authorized'],
            // authority: ['admin', 'user'],
            routes: [
              {
                path: '/dashboard',
                name: '工作台',
                icon: 'dashboard',
                component: './dashboard',
              },
              // {
              //   path: '/application',
              //   name: '产品管理',
              //   icon: 'profile',
              //   component: './application',
              // },
              // {
              //   path: '/config',
              //   name: '产品配置',
              //   icon: 'profile',
              //   routes: [
              //     {
              //       name: '数据模型',
              //       icon: 'smile',
              //       path: '/config/datamodel',
              //       component: './config/datamodel',
              //     },
              //     {
              //       name: '查询框',
              //       icon: 'smile',
              //       path: '/config/queryparam',
              //       component: './config/queryparam',
              //     },
              //     {
              //       path: '/param',
              //       name: '参数配置',
              //       icon: 'profile',
              //       component: './param',
              //       extends: {
              //         global: true,
              //       },
              //     },
              //     {
              //       path: '/dictionary',
              //       name: '数据字典',
              //       icon: 'profile',
              //       component: './dictionary',
              //       extends: {
              //         global: true,
              //       },
              //     },
              //     {
              //       path: '/dataitem',
              //       name: '元数据',
              //       icon: 'profile',
              //       component: './dataitem',
              //       extends: {
              //         global: true,
              //       },
              //     },
              //   ],
              // },
              // {
              //   name: 'exception',
              //   icon: 'warning',
              //   path: '/exception',
              //   routes: [
              //     {
              //       name: '403',
              //       icon: 'smile',
              //       path: '/exception/403',
              //       component: './exception/403',
              //     },
              //     {
              //       name: '404',
              //       icon: 'smile',
              //       path: '/exception/404',
              //       component: './exception/404',
              //     },
              //     {
              //       name: '500',
              //       icon: 'smile',
              //       path: '/exception/500',
              //       component: './exception/500',
              //     },
              //   ],
              // },
              {
                name: '开发框架',
                icon: 'CodeSandboxOutlined',
                path: '/framework',
                routes: [
                  {
                    name: '代码生成器',
                    icon: 'CodeOutlined',
                    path: '/framework/initializr',
                    routes: [
                      {
                        name: '前端',
                        icon: 'ChromeOutlined',
                        path: '/framework/initializr/frontend',
                        component: './framework/initializr/frontend',
                      },
                      {
                        name: '后端',
                        icon: 'ChromeOutlined',
                        path: '/framework/initializr/backend',
                        component: './framework/initializr/backend',
                      },
                    ],
                  },
                ],
              },
              {
                name: '业务规则引擎',
                icon: 'CodeOutlined',
                path: '/rule',
                routes: [
                  {
                    name: '规则集',
                    icon: 'ChromeOutlined',
                    path: '/rule/package',
                    component: './rule/package',
                  },
                  {
                    name: '规则定义',
                    icon: 'ProfileOutlined',
                    path: '/rule/ruler',
                    component: './rule/ruler',
                  },
                  {
                    name: '规则集编辑',
                    icon: 'ChromeOutlined',
                    path: '/rule/package/edit/:code',
                    component: './rule/package/edit',
                    hideInMenu: true,
                  },
                  {
                    name: '执行记录',
                    icon: 'ChromeOutlined',
                    path: '/rule/instance',
                    component: './rule/instance',
                  },
                ],
              },
              {
                name: '微信平台',
                icon: 'WechatOutlined',
                path: '/wechat',
                routes: [
                  {
                    name: '微信应用',
                    icon: 'ChromeOutlined',
                    path: '/wechat/app',
                    component: './wechat/app',
                  },
                ],
              },
              {
                name: '消息平台',
                icon: 'MessageOutlined',
                path: '/message',
                routes: [
                  {
                    name: '消息记录',
                    icon: 'ChromeOutlined',
                    path: '/message/list',
                    component: './message/list',
                  },
                ],
              },
              {
                name: '微服务文档',
                icon: 'ZhihuOutlined',
                path: '/framework/document',
                routes: [
                  {
                    name: '审批中心',
                    icon: 'ChromeOutlined',
                    path:
                      'https://resource-1302072249.cos.ap-guangzhou.myqcloud.com/document/bpm/index.html',
                  },
                  {
                    name: '开发者中心',
                    icon: 'ChromeOutlined',
                    path:
                      'https://resource-1302072249.cos.ap-guangzhou.myqcloud.com/document/developer/index.html',
                  },
                ],
              },
              {
                name: '代码库',
                icon: 'GitlabOutlined',
                path: 'https://gitlab.gzmpc.com',
                target: '_blank',
              },

              {
                name: 'DevOps',
                icon: 'CodepenCircleOutlined',
                path: 'https://gzmpc.coding.net',
                target: '_blank',
              },
              {
                path: '/',
                redirect: '/dashboard',
              },
              {
                component: '404',
              },
            ],
          },
        ],
      },
    ],
  },
];
