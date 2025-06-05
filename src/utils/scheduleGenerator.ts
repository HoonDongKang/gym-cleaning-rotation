import type { Member, MemberSchedule } from '@/types';
import { useDayjs } from './dayjs';

type GenerateMonthlyScheduleParams = {
  members: Member[];
  currentDate: string;
};
const CLEANING_DAYS = [1, 2, 3, 4];
const dayjs = useDayjs();

export class ScheduleGenerator {
  schedules: MemberSchedule[];

  eventGuid: number;
  dateAssignments: Map<string, Member[]>;

  cleaningDates: string[];
  lessonMTDates: string[];
  lessonTTDates: string[];

  nonLessonMembers: Member[];
  allLessonMembers: Member[];
  lessonMWMembers: Member[];
  lessonTTMembers: Member[];

  constructor() {
    this.schedules = [];

    this.eventGuid = 0;
    this.dateAssignments = new Map<string, Member[]>();

    this.cleaningDates = [];
    this.lessonMTDates = [];
    this.lessonTTDates = [];

    this.nonLessonMembers = [];
    this.allLessonMembers = [];
    this.lessonMWMembers = [];
    this.lessonTTMembers = [];
  }

  initMemberSchedule(member: Member): MemberSchedule {
    return {
      id: String(this.eventGuid++),
      title: member.name,
      start: member?.start || '',
      backgroundColor: member?.color || '#3788d8',
      borderColor: member?.borderColor || '#3788d8',
    };
  }
  /**
   * 1. 설정된 월의 스케쥴을 작성한다.
   * 2. 청소는 월, 화, 수, 목 만 수행한다.
   * 3. 모든 회원은 월 1회만 청소를 수행한다.
   * 4. 월/수 레슨 회원은 월 혹은 수요일에 청소를 수행한다.
   * 5. 화/목 레슨 회원은 화 혹은 목요일에 청소를 수행한다.
   */

  generateMonthlySchedule({ members, currentDate }: GenerateMonthlyScheduleParams) {
    const schedules: MemberSchedule[] = [];

    //1. 해당 달의 [월/수], [화/목] [나머지] 청소 날짜를 구한다.
    this.generateCleaningSchedules(currentDate, CLEANING_DAYS);

    //2. [레슨X], [모든 레슨], [레슨MW], [레슨TT]로 회원 구분
    this.getSeparatedMembers(members);

    // 3. [레슨MW], [레슨TT] 회원 분배 (월/수, 화/목)
    this.distributeLessonMembers(this.lessonMWMembers, this.lessonMTDates);
    this.distributeLessonMembers(this.lessonTTMembers, this.lessonTTDates);

    // 4. [모든 레슨] 분배 (월,화,수,목 중 비어있는 곳으로)
    this.distributeNonLessonMembers(this.allLessonMembers, [
      ...this.lessonMTDates,
      ...this.lessonTTDates,
    ]);

    // 5. 레슨X 회원들을 비어있는 곳에 분배
    this.distributeNonLessonMembers(this.nonLessonMembers, [
      ...this.lessonMTDates,
      ...this.lessonTTDates,
      ...this.cleaningDates,
    ]);
  }

  generateCleaningSchedules(date: string, days: number[]) {
    let currentDate = dayjs(date).startOf('month');

    const daysInMonth = currentDate.daysInMonth();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = currentDate.day();

      if (days.includes(dayOfWeek)) {
        switch (dayOfWeek) {
          case 1:
          case 3:
            this.lessonMTDates.push(currentDate.format('YYYY-MM-DD'));
            break;
          case 2:
          case 4:
            this.lessonTTDates.push(currentDate.format('YYYY-MM-DD'));
            break;
          default:
            this.cleaningDates.push(currentDate.format('YYYY-MM-DD'));
            break;
        }
      }

      currentDate = currentDate.add(1, 'day');
    }

    [...this.lessonMTDates, ...this.lessonTTDates].forEach((date) => {
      this.dateAssignments.set(date, []);
    });
  }

  getSeparatedMembers(members: Member[]) {
    members.forEach((member) => {
      if (member.schedule.length === 0) {
        this.nonLessonMembers.push(member);
      } else if (member.schedule.length === 2) {
        this.allLessonMembers.push(member);
      } else if (member.schedule.includes('lessonMW')) {
        this.lessonMWMembers.push(member);
      } else if (member.schedule.includes('lessonTT')) {
        this.lessonTTMembers.push(member);
      }
    });
  }

  distributeLessonMembers(members: Member[], availableDates: string[]) {
    members.forEach((member, index) => {
      const dateIndex = index % availableDates.length;
      const assignedDate = availableDates[dateIndex];

      const assignedMembers = this.dateAssignments.get(assignedDate) || [];
      assignedMembers.push(member);
      this.dateAssignments.set(assignedDate, assignedMembers);

      const schedule = this.initMemberSchedule(member);
      schedule.start = assignedDate;
      this.schedules.push(schedule);
    });
  }

  distributeNonLessonMembers(members: Member[], availableDates: string[]) {
    members.forEach((member) => {
      const leastAssignedDate = this.findLeastAssignedDate(availableDates);

      const assignedMembers = this.dateAssignments.get(leastAssignedDate) || [];
      assignedMembers.push(member);
      this.dateAssignments.set(leastAssignedDate, assignedMembers);

      const schedule = this.initMemberSchedule(member);
      schedule.start = leastAssignedDate;
      this.schedules.push(schedule);
    });
  }

  findLeastAssignedDate(dates: string[]): string {
    return dates.reduce((leastDate, currentDate) => {
      const leastCount = this.dateAssignments.get(leastDate)?.length || 0;
      const currentCount = this.dateAssignments.get(currentDate)?.length || 0;
      return currentCount < leastCount ? currentDate : leastDate;
    });
  }
}
