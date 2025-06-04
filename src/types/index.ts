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
  schedule: string[];
};

export type { MemberSchedule, Member };
