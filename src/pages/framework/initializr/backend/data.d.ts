

export type Project = {
  name: string;
  type: 'support' | 'single' | 'portal' | 'micro';
  version: string;
  group: string;
  artifact: string;
  description: string;
};

type Tag = {
  color: string;
  title: string;
}

export type Module = {
  key: string;
  name: string;
  image: string;
  tags: Tag[] = [];
  description: string;
};
