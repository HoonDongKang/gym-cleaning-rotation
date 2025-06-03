<template>
  <div class="calendar-app">
    <schedule-btn-group @update="handleDateUpdate" />
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
import { ref, onMounted, nextTick, computed } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDayjs } from '@/utils/dayjs';
import ScheduleBtnGroup from './ScheduleBtnGroup.vue';

const dayjs = useDayjs();
const currentDate = ref(dayjs());
const fullCalendar = ref(null);
const isDragging = ref(false);
const calendarReady = ref(false);
let eventGuid = 0;

// 초기 이벤트 데이터
const JULY_EVENTS = [
  {
    id: String(eventGuid++),
    title: '김철수',
    start: '2025-07-01',
    backgroundColor: '#3788d8',
    borderColor: '#3788d8',
  },
  {
    id: String(eventGuid++),
    title: '이영희',
    start: '2025-07-02',
    backgroundColor: '#f56565',
    borderColor: '#f56565',
  },
  {
    id: String(eventGuid++),
    title: '박민수',
    start: '2025-07-03',
    backgroundColor: '#38a169',
    borderColor: '#38a169',
  },
  {
    id: String(eventGuid++),
    title: '정수진',
    start: '2025-07-07',
    backgroundColor: '#9f7aea',
    borderColor: '#9f7aea',
  },
  {
    id: String(eventGuid++),
    title: '최동욱',
    start: '2025-07-08',
    backgroundColor: '#ed8936',
    borderColor: '#ed8936',
  },
  {
    id: String(eventGuid++),
    title: '한서연',
    start: '2025-07-09',
    backgroundColor: '#e53e3e',
    borderColor: '#e53e3e',
  },
  {
    id: String(eventGuid++),
    title: '임재현',
    start: '2025-07-10',
    backgroundColor: '#00b894',
    borderColor: '#00b894',
  },
];

// 이벤트 ID 생성 함수
function createEventId() {
  return String(eventGuid++);
}

// 날짜 선택 핸들러
function handleDateSelect(selectInfo) {
  const title = prompt('청소당번 이름을 입력하세요:');
  const calendarApi = selectInfo.view.calendar;

  calendarApi.unselect();

  if (title) {
    const colors = ['#3788d8', '#f56565', '#38a169', '#9f7aea', '#ed8936', '#e53e3e', '#00b894'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    calendarApi.addEvent({
      id: createEventId(),
      title: title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      backgroundColor: randomColor,
      borderColor: randomColor,
    });
  }
}

// 이벤트 클릭 핸들러
function handleEventClick(clickInfo) {
  if (!isDragging.value && confirm(`'${clickInfo.event.title}' 청소당번을 삭제하시겠습니까?`)) {
    clickInfo.event.remove();
  }
}

// 이벤트 드래그 핸들러
function handleEventDrop(info) {
  const date = info.event.start;
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  console.log(`${info.event.title}이(가) ${dateStr}로 이동되었습니다.`);
  updateEventOnServer(info.event);
}

function handleEventDragStart() {
  isDragging.value = true;
}

function handleEventDragStop() {
  setTimeout(() => {
    isDragging.value = false;
  }, 100);
}

async function updateEventOnServer(event) {
  try {
    console.log('서버 업데이트 완료:', event.title);
  } catch (error) {
    console.error('서버 업데이트 실패:', error);
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
  events: [...JULY_EVENTS], // 배열 복사로 반응성 확보
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventDrop: handleEventDrop,
  eventDragStart: handleEventDragStart,
  eventDragStop: handleEventDragStop,
  locale: 'ko',
  height: 'auto',
  aspectRatio: 1.35,
}));

const handleDateUpdate = (newDate) => {
  if (fullCalendar.value) {
    const calendarApi = fullCalendar.value.getApi();
    console.log(calendarApi);

    const dateToGo = newDate.toDate();
    calendarApi.gotoDate(dateToGo);
  }
};

// 컴포넌트 마운트 후 초기화
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
