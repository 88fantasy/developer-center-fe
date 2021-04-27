

export type RulePackageList = {
  code: string;
  name: string;
  description: string;
  ruleCount: number;
  history: number;
  today: number;
};

export type Rule = {
  code: string;
  name: string;
  description: string;
  type: 'CODE' | 'SPEL' | 'MVEL' | 'GROUP';
  expression: string;
  priority?: number;
};

export type RulePackage = RulePackageList & {
  rules?: Rule[];
  skipOnFirstAppliedRule: boolean;
  skipOnFirstFailedRule: boolean;
  skipOnFirstNonTriggeredRule: boolean;
  rulePriorityThreshold: boolean;
};
