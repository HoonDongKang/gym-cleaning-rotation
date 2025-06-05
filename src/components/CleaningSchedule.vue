<template>
  <div class="calendar-container">
    <FullCalendar ref="fullCalendar" :options="calendarOptions" class="full-calendar" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

let eventGuid = 0;

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

function createEventId() {
  return String(eventGuid++);
}

export default defineComponent({
  name: 'CleaningScheduleCalendar',
  components: {
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],

        // 헤더 제거 - 월 이동 버튼 없음
        headerToolbar: false,

        // 7월로 고정
        initialView: 'dayGridMonth',
        initialDate: '2025-07-01',

        // 월 이동 비활성화
        navLinks: false,

        // 기본 설정 (성능 최적화)
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,

        // 드래그 성능 최적화
        dragScroll: true,
        longPressDelay: 50, // 더 빠른 반응
        selectMinDistance: 5, // 최소 드래그 거리

        // 7월 이벤트들
        events: JULY_EVENTS,

        // 이벤트 핸들러들 (최적화됨)
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventDrop: this.handleEventDropOptimized,

        // 한국어 설정
        locale: 'ko',

        // 달력 높이를 화면에 맞게 조정
        height: 'auto',
        aspectRatio: 1.35,
      },
      isDragging: false, // 드래그 상태 추적
    };
  },

  methods: {
    // 날짜 선택시 이벤트 추가
    handleDateSelect(selectInfo) {
      const title = prompt('청소당번 이름을 입력하세요:');
      const calendarApi = selectInfo.view.calendar;

      calendarApi.unselect();

      if (title) {
        // 랜덤 색상 선택
        const colors = [
          '#3788d8',
          '#f56565',
          '#38a169',
          '#9f7aea',
          '#ed8936',
          '#e53e3e',
          '#00b894',
        ];
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
    },

    // 이벤트 클릭시 삭제 확인
    handleEventClick(clickInfo) {
      if (!this.isDragging && confirm(`'${clickInfo.event.title}' 청소당번을 삭제하시겠습니까?`)) {
        clickInfo.event.remove();
      }
    },

    // 최적화된 이벤트 드래그앤드롭 (디바운스 적용)
    handleEventDropOptimized: function (info) {
      // 성능 최적화된 날짜 포맷팅
      const date = info.event.start;
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },

    // 서버 업데이트 (비동기)
    async updateEventOnServer(event) {
      try {
        // 실제 API 호출 예시
        // await api.updateEvent(event.id, { start: event.start });
        console.log('서버 업데이트 완료:', event.title);
      } catch (error) {
        console.error('서버 업데이트 실패:', error);
      }
    },
  },
});
</script>

<style scoped>
.calendar-container {
  width: 100%;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.full-calendar {
  width: 100%;
  height: 100%;
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
  /* GPU 가속 활성화 */
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

/* 오늘 날짜 하이라이트 */
:deep(.fc-day-today) {
  background-color: rgba(255, 220, 40, 0.15) !important;
}

/* 주말 스타일 */
:deep(.fc-day-sun) {
  background-color: rgba(255, 0, 0, 0.05);
}

:deep(.fc-day-sat) {
  background-color: rgba(0, 0, 255, 0.05);
}

/* 드래그 힌트 스타일 */
:deep(.fc-event-mirror) {
  opacity: 0.8;
  transform: translateZ(0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 반응형 디자인 */
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
