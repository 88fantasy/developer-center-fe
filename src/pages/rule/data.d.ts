
export type Package = {
  code: string;
  name: string;
  description: string;
}

export type RulePackageList = Package & {
  ruleCount?: number;
  history?: number;
  today?: number;
};

export type Rule = {
  code: string;
  name: string;
  description: string;
  type: 'CODE' | 'SPEL' | 'MVEL' | 'GROUP';
  expression: string;
  action: string;
  priority?: number;
  input?: string;
  output?: string;
  tags?: string;
};

export type RulePackage = Package & {
  rules?: Rule[];
  skipOnFirstAppliedRule: boolean = false;
  skipOnFirstFailedRule: boolean = false;
  skipOnFirstNonTriggeredRule: boolean = false;
  rulePriorityThreshold?: number;
};
