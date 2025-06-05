<template>
  <div class="calendar-app">
    <schedule-btn-group
      @update="handleDateUpdate"
      @generate="generateSchedule"
      @export="exportSchedule"
    />
    <div class="calendar-container">
      <FullCalendar
        v-if="calendarReady"
        ref="fullCalendar"
        :options="calendarOptions"
        class="full-calendar"
      />
      <div v-else class="loading-state">캘린더를 로딩 중입니다...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, defineProps } from 'vue';
import ExcelJS from 'exceljs';
import { useDayjs } from '@/utils/dayjs';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ScheduleBtnGroup from './ScheduleBtnGroup.vue';
import { ScheduleGenerator } from '@/utils/scheduleGenerator';

const props = defineProps(['members']);

const dayjs = useDayjs();
const fullCalendar = ref(null);

const isDragging = ref(false);
const calendarReady = ref(false);

const currentDate = ref(dayjs());
const scheduleGenerator = ref(new ScheduleGenerator());

function generateSchedule() {
  if (!props.members || props.members.length === 0) {
    alert('회원 정보가 없습니다. 먼저 회원을 등록해주세요.');
    return;
  }

  try {
    scheduleGenerator.value.generateMonthlySchedule({
      members: props.members,
      currentDate: currentDate.value.format('YYYY-MM-DD'),
    });

    const generatedSchedules = [...scheduleGenerator.value.schedules];

    // 새로운 스케줄을 캘린더에 추가
    if (fullCalendar.value && generatedSchedules.length > 0) {
      const calendarApi = fullCalendar.value.getApi();

      generatedSchedules.forEach((schedule) => {
        calendarApi.addEvent(schedule);
      });

      alert(`${generatedSchedules.length}개의 청소 일정이 생성되었습니다.`);
    } else if (generatedSchedules.length === 0) {
      alert('생성할 일정이 없습니다.');
    }
  } catch (error) {
    console.error('스케줄 생성 중 오류 발생:', error);
    alert('스케줄 생성 중 오류가 발생했습니다. 콘솔을 확인해주세요.');
  }
}

// 날짜 선택 핸들러
function handleDateSelect(selectInfo) {
  const title = prompt('회원명을 입력하세요:');
  const calendarApi = selectInfo.view.calendar;

  calendarApi.unselect();

  if (title) {
    const colors = ['#3788d8', '#f56565', '#38a169', '#9f7aea', '#ed8936', '#e53e3e', '#00b894'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const schedule = scheduleGenerator.value.initMemberSchedule({
      name: title,
      start: selectInfo.startStr,
      color: randomColor,
      borderColor: randomColor,
    });

    calendarApi.addEvent(schedule);
  }
}

function handleEventClick(clickInfo) {
  if (!isDragging.value && confirm(`'${clickInfo.event.title}' 청소당번을 삭제하시겠습니까?`)) {
    clickInfo.event.remove();
  }
}

const handleDateUpdate = (newDate) => {
  if (fullCalendar.value) {
    const calendarApi = fullCalendar.value.getApi();

    const dateToGo = newDate.toDate();
    calendarApi.gotoDate(dateToGo);
  }

  currentDate.value = newDate;
};

// 스케줄 초기화 함수 추가
function clearGeneratedSchedules() {
  if (fullCalendar.value) {
    const calendarApi = fullCalendar.value.getApi();
    const existingEvents = calendarApi.getEvents();
    existingEvents.forEach((event) => {
      if (event.extendedProps.isGenerated) {
        event.remove();
      }
    });
  }
}

async function exportSchedule() {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const groupingSchedules = new Map();
  const calendarApi = fullCalendar.value.getApi();
  const existingEvents = calendarApi.getEvents();
  const schedules = existingEvents
    .map((event) => ({
      title: event.title,
      start: event.startStr,
    }))
    .sort((a, b) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf());

  schedules.forEach((schedule) => {
    const date = schedule.start;
    const name = schedule.title;

    const existing = groupingSchedules.get(date) || [];
    groupingSchedules.set(date, [...existing, name]);
  });

  try {
    if (!schedules?.length) return;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('청소 스케쥴');
    worksheet.addRow(['날짜', '요일', '청소 담당자']);

    groupingSchedules.forEach((value, key) => {
      const dayIndex = dayjs(key).day();
      const dayText = dayNames[dayIndex];
      worksheet.addRow([key, dayText, value.join(', ')]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer]);
    const link = document.createElement('a');
    const month = dayjs(currentDate.value).month();
    link.href = URL.createObjectURL(blob);
    link.download = `${month + 1}월_회원목록.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (e) {
    console.error('파일 읽기 오류', e);
  }
}
// 캘린더 옵션을 computed로 변경하여 반응성 확보
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  headerToolbar: false,
  initialView: 'dayGridMonth',
  initialDate: currentDate.value.format('YYYY-MM-DD'),
  navLinks: false,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  dragScroll: true,
  longPressDelay: 50,
  selectMinDistance: 5,
  events: [], // 이벤트는 직접 API로 추가하므로 빈 배열
  select: handleDateSelect,
  eventClick: handleEventClick,
  locale: 'ko',
  height: 'auto',
  aspectRatio: 1.35,
}));

onMounted(async () => {
  try {
    await nextTick();

    setTimeout(() => {
      calendarReady.value = true;
    }, 100);
  } catch (error) {
    console.error('캘린더 초기화 오류:', error);
    calendarReady.value = true;
  }
});
</script>

<style scoped>
.calendar-app {
  width: 100%;
  min-height: 100vh;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  padding: 20px;
  box-sizing: border-box;
}

.calendar-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 20px;
}

.full-calendar {
  width: 100%;
  height: 100%;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  font-size: 16px;
  color: #666;
}

:deep(.fc) {
  font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
  font-size: 14px;
}

:deep(.fc-view-harness) {
  height: 100% !important;
}

:deep(.fc-daygrid-day) {
  min-height: 120px;
}

:deep(.fc-event) {
  cursor: pointer;
  border-radius: 4px;
  padding: 2px 4px;
  font-weight: 500;
  will-change: transform;
  transform: translateZ(0);
}

:deep(.fc-event:not(.fc-event-dragging):hover) {
  opacity: 0.8;
  transform: scale(1.02) translateZ(0);
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

:deep(.fc-event.fc-event-dragging) {
  transition: none !important;
  transform: translateZ(0);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

:deep(.fc-daygrid-event) {
  margin: 1px 2px;
}

:deep(.fc-event-title) {
  font-weight: 600;
}

:deep(.fc-day-today) {
  background-color: rgba(255, 220, 40, 0.15) !important;
}

:deep(.fc-day-sun) {
  background-color: rgba(255, 0, 0, 0.05);
}

:deep(.fc-day-sat) {
  background-color: rgba(0, 0, 255, 0.05);
}

:deep(.fc-event-mirror) {
  opacity: 0.8;
  transform: translateZ(0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .calendar-container {
    padding: 10px;
  }

  :deep(.fc) {
    font-size: 12px;
  }

  :deep(.fc-daygrid-day) {
    min-height: 80px;
  }
}
</style>
