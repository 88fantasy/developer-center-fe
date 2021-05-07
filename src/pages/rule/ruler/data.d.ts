
export type RuleTypeCountResponse = {
  type: string; 
  count: number;
};

export type RuleTagCountResponse = {
  tag: string;
  count: number;
}

export type RuleStatisticResponse = {
  typeCount: RuleTypeCountResponse[];
  tagCount: RuleTagCountResponse[];
}