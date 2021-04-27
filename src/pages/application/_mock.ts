// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { AppItemDataType } from './data.d';

const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack',
];
const avatars = [
  'https://www.gzmpc.com/logos/source.png', 
  'https://www.gzmpc.com/logos/busince.png', 
  'https://www.gzmpc.com/logos/plan.png', 
  'https://www.gzmpc.com/logos/settle.png', 
  'https://www.gzmpc.com/logos/report.png', 
  'https://www.gzmpc.com/logos/notice.png', 
  'https://www.gzmpc.com/logos/talk.png', 
  'https://www.gzmpc.com/logos/user.png', 
];

const desc = [
  '那是一种内在的东西， 他们到达不了，也无法触及的',
  '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  '生命就像一盒巧克力，结果往往出人意料',
  '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  '那时候我只会想自己想要什么，从不想自己拥有什么',
];

function fakeApp(count: number): AppItemDataType[] {
  const list:AppItemDataType[] = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      code: `app-${i}`,
      title: titles[i % 8],
      status : 'active',
      logo: avatars[i % 8],
      href: 'https://ant.design',
      updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
      subDescription: desc[i % 5],
      description:
        '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
      members: [
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
          name: '曲丽丽',
          id: 'member1',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
          name: '王昭君',
          id: 'member2',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
          name: '董娜娜',
          id: 'member3',
        },
      ],
    });
  }

  return list;
}

function getAppList(req: Request, res: Response) {
  const params = req.query;

  const count = params.count * 1 || 20;

  const result = fakeApp(count);
  return res.json(result);
}

export default {
  'GET  /api/getAppList': getAppList,
};
