export type Community =
  | "adhd"
  | "autism"
  | "dyslexia"
  | "anxiety"
  | "depression"
  | "student"
  | "professional"
  | "parent";

export type Problem =
  | "planning"
  | "task-initiation"
  | "focus"
  | "sensory"
  | "social"
  | "emotional-regulation"
  | "time-management"
  | "organization"
  | "motivation"
  | "sleep"
  | "communication"
  | "overwhelm";

export type Urgency = "low" | "medium" | "high" | "crisis";

export interface Resource {
  id: string;
  name: string;
  communities: Community[];
  problems: Problem[];
  urgency: Urgency;
  humanSupport: boolean;
  description: string;
  link: string;
  nextAction: string;
}

export interface Intent {
  communities: Community[];
  problem: Problem;
  timeframe: string;
  urgency: Urgency;
  wantsHumanHelp: boolean;
}

export interface ScoredResource {
  resource: Resource;
  score: number;
}
