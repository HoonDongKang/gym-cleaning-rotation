import type { Member, MemberSchedule } from '@/types';
import { useDayjs } from './dayjs';

type GenerateMonthlyScheduleParams = {
  members: Member[];
  currentDate: string;
};

let eventGuid = 0;
const CLEANING_DAYS = [1, 2, 3, 4];
const dayjs = useDayjs();
const dateAssignments = new Map<string, Member[]>();

export function initMemberSchedule(member: Member): MemberSchedule {
  return {
    id: String(eventGuid++),
    title: member.name,
    start: '',
    backgroundColor: '#3788d8',
    borderColor: '#3788d8',
  };
}

/**
 * 1. 설정된 월의 스케쥴을 작성한다.
 * 2. 청소는 월, 화, 수, 목 만 수행한다.
 * 3. 모든 회원은 월 1회만 청소를 수행한다.
 * 4. 월/수 레슨 회원은 월 혹은 수요일에 청소를 수행한다.
 * 5. 화/목 레슨 회원은 화 혹은 목요일에 청소를 수행한다.
 */

/**
 * 1. 해당 달의 [월/수], [화/목] [나머지] 청소 날짜를 구한다.
 * 2. [레슨X], [모든 레슨], [레슨MW], [레슨TT]로 회원 구분
 * 3. [레슨MW], [레슨TT] 회원 분배 (월/수, 화/목)
 * 4. [모든 레슨] 분배 (월,화,수,목 중 비어있는 곳으로)
 * 5. [레슨X] 분배 (월,화,수,목 중 비어있는 곳으로)
 *
 * - 비어 있는 곳
 * - 레슨 일자 수 / 레슨 회원 수가 평균치
 * - 만약 평균치보다 적은 회원이 할당되었을 경우 비어있는 곳이라 판단
 */
export function generateMonthlySchedule({
  members,
  currentDate,
}: GenerateMonthlyScheduleParams): MemberSchedule[] {
  const schedules: MemberSchedule[] = [];

  //1. 해당 달의 [월/수], [화/목] [나머지] 청소 날짜를 구한다.
  const { cleaningDates, lessonMTDates, lessonTTDates } = getCleaningDates(
    currentDate,
    CLEANING_DAYS,
  );

  //2. [레슨X], [모든 레슨], [레슨MW], [레슨TT]로 회원 구분
  const { nonLessonMembers, allLessonMembers, lessonMWMembers, lessonTTMembers } =
    getSeparatedMembers(members);

  // 3. [레슨MW], [레슨TT] 회원 분배 (월/수, 화/목)
  distributeLessonMembers(lessonMWMembers, lessonMTDates, schedules);
  distributeLessonMembers(lessonTTMembers, lessonTTDates, schedules);

  // 4. [모든 레슨] 분배 (월,화,수,목 중 비어있는 곳으로)
  const allCleaningDates = [...lessonMTDates, ...lessonTTDates];
  distributeNonLessonMembers(allLessonMembers, allCleaningDates, schedules);

  // 5. 레슨X 회원들을 비어있는 곳에 분배
  distributeNonLessonMembers(nonLessonMembers, allCleaningDates, schedules);

  return schedules;
}

function distributeLessonMembers(
  members: Member[],
  availableDates: string[],
  schedules: MemberSchedule[],
) {
  members.forEach((member, index) => {
    const dateIndex = index % availableDates.length;
    const assignedDate = availableDates[dateIndex];

    const assignedMembers = dateAssignments.get(assignedDate) || [];
    assignedMembers.push(member);
    dateAssignments.set(assignedDate, assignedMembers);

    const schedule = initMemberSchedule(member);
    schedule.start = assignedDate;
    schedules.push(schedule);
  });
}

function distributeNonLessonMembers(
  members: Member[],
  availableDates: string[],
  schedules: MemberSchedule[],
) {
  members.forEach((member) => {
    const leastAssignedDate = findLeastAssignedDate(availableDates, dateAssignments);

    const assignedMembers = dateAssignments.get(leastAssignedDate) || [];
    assignedMembers.push(member);
    dateAssignments.set(leastAssignedDate, assignedMembers);

    const schedule = initMemberSchedule(member);
    schedule.start = leastAssignedDate;
    schedules.push(schedule);
  });
}

function findLeastAssignedDate(dates: string[], dateAssignments: Map<string, Member[]>): string {
  return dates.reduce((leastDate, currentDate) => {
    const leastCount = dateAssignments.get(leastDate)?.length || 0;
    const currentCount = dateAssignments.get(currentDate)?.length || 0;
    return currentCount < leastCount ? currentDate : leastDate;
  });
}

function getCleaningDates(date: string, days: number[]) {
  const cleaningDates: string[] = [];
  const lessonMTDates: string[] = [];
  const lessonTTDates: string[] = [];

  let currentDate = dayjs(date).startOf('month');

  const daysInMonth = currentDate.daysInMonth();
  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = currentDate.day();

    if (days.includes(dayOfWeek)) {
      switch (dayOfWeek) {
        case 1:
        case 3:
          lessonMTDates.push(currentDate.format('YYYY-MM-DD'));
          break;
        case 2:
        case 4:
          lessonTTDates.push(currentDate.format('YYYY-MM-DD'));
          break;
        default:
          cleaningDates.push(currentDate.format('YYYY-MM-DD'));
          break;
      }
    }

    currentDate = currentDate.add(1, 'day');
  }

  [...lessonMTDates, ...lessonTTDates].forEach((date) => {
    dateAssignments.set(date, []);
  });

  return { cleaningDates, lessonMTDates, lessonTTDates };
}

function getSeparatedMembers(members: Member[]) {
  const nonLessonMembers: Member[] = [];
  const allLessonMembers: Member[] = [];
  const lessonMWMembers: Member[] = [];
  const lessonTTMembers: Member[] = [];

  members.forEach((member) => {
    if (member.schedule.length === 0) {
      nonLessonMembers.push(member);
    } else if (member.schedule.length === 2) {
      allLessonMembers.push(member);
    } else if (member.schedule.includes('lessonMW')) {
      lessonMWMembers.push(member);
    } else if (member.schedule.includes('lessonTT')) {
      lessonTTMembers.push(member);
    }
  });

  return {
    nonLessonMembers,
    allLessonMembers,
    lessonMWMembers,
    lessonTTMembers,
  };
}
