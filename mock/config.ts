import { Request, Response } from 'express';

function getFakeCaptcha(req: Request, res: Response) {
  return res.json('captcha-xxx');
}
// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /ddl/options/MessageType': (req: Request, res: Response) => {
    res.json([
      {
        label: '短信',
        value: 'message',
      },
    ]);
  },
  'POST /ddl/many': (req: Request, res: Response) => {
    res.json({
      code: 200,
      status: true,
      data: {
        messageType: [
          {
            label: '短信',
            value: 'message',
          },
        ],
        sendedEnum: [
          {
            label: '等待中',
            value: 'waiting',
          },
          {
            label: '已发送',
            value: 'success',
          },
          {
            label: '发送失败',
            value: 'fail',
          },
        ],
      },
    });
  },

  'GET  /api/login/captcha': getFakeCaptcha,
};
