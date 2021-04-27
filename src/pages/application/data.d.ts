export interface Member {
  avatar: string;
  name: string;
  id: string;
}

export interface AppItemDataType {
  code: string;
  title: string;
  status: 'normal' | 'exception' | 'active' | 'success';
  logo: string;
  href?: string;
  updatedAt: number;
  createdAt: number;
  subDescription: string;
  description: string;
  members: Member[];
}
