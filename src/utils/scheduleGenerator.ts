import { Member, MonthlySchedule, CleaningSchedule } from '@/types';

export function generateMonthlySchedule(
  members: Member[],
  year: number,
  month: number,
): MonthlySchedule {
  const schedules: CleaningSchedule[] = [];
  const memberRotation: { [key: string]: Date | null } = {};

  // 회원별 마지막 청소 날짜 초기화
  members.forEach((member) => {
    memberRotation[member.id] = null;
  });

  // 해당 월의 월~목 날짜들 구하기
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const weekdays = [];

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay();
    // 월(1), 화(2), 수(3), 목(4)만 포함
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      weekdays.push({
        date: new Date(date),
        dayOfWeek: ['', 'monday', 'tuesday', 'wednesday', 'thursday'][dayOfWeek] as
          | 'monday'
          | 'tuesday'
          | 'wednesday'
          | 'thursday',
      });
    }
  }

  // 각 날짜에 대해 청소 담당자 배정
  weekdays.forEach(({ date, dayOfWeek }) => {
    const availableMembers = members.filter((member) => {
      // 해당 요일 레슨을 받는 회원만 필터링
      if (dayOfWeek === 'monday' || dayOfWeek === 'wednesday') {
        return member.monWedLesson;
      } else if (dayOfWeek === 'tuesday' || dayOfWeek === 'thursday') {
        return member.tueThurLesson;
      }
      return false;
    });

    // 마지막 청소일로부터 가장 오래된 순으로 정렬
    availableMembers.sort((a, b) => {
      const aLastCleaning = memberRotation[a.id];
      const bLastCleaning = memberRotation[b.id];

      if (!aLastCleaning && !bLastCleaning) return 0;
      if (!aLastCleaning) return -1;
      if (!bLastCleaning) return 1;

      return aLastCleaning.getTime() - bLastCleaning.getTime();
    });

    // 하루에 3-4명 배정 (가용 인원에 따라 조정)
    const assignCount = Math.min(4, Math.max(3, Math.floor(availableMembers.length / 8)));
    const assignedMembers = availableMembers.slice(0, assignCount);

    // 배정된 회원들의 마지막 청소일 업데이트
    assignedMembers.forEach((member) => {
      memberRotation[member.id] = new Date(date);
    });

    schedules.push({
      id: `${date.getTime()}`,
      date: new Date(date),
      members: assignedMembers,
      dayOfWeek,
    });
  });

  return {
    year,
    month: month + 1, // 표시용으로 1 증가
    schedules,
  };
}
