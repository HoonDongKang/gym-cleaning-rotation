type MemberSchedule = {
  id: string;
  title: string;
  start: string;
  backgroundColor?: string;
  borderColor?: string;
};

type Member = {
  id: string;
  name: string;
  start?: string;
  schedule: string[];
  color?: string;
  borderColor?: string;
};

export type { MemberSchedule, Member };
