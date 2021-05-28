import type { RulePackage, Rule, } from '../data.d';

export type Instance = {
  id: string;
  status: 'INIT' | 'PROCESSING' | 'FINISHED' | 'FAILED';
  startTime: datetime;
  endTime?: datetime;
}


export type RulePackageInstance = RulePackage & Instance & {
  sourceId?: string;
  ip: string;
};

export type RuleInstance = Rule & Instance & {
  // id: string;
}
