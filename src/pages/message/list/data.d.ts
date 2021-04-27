
export type Message = {
  id: string;
  typeCode: string;
  sourceData: string;
  subject: string;
  content: string;
  target: string;
  messageType: string;
  failCount: number;
  sended: boolean;
  sendTime: datetime;
  feedback: string;
  ip: string;
  credate: datetime;
  priority: number;
  invalidDate: datetime;
};
