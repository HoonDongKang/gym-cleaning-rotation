<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" lg="10" xl="8" class="mt-4">
        <div class="text-center">
          <div class="d-flex align-center justify-center mb-3">
            <v-icon color="primary" size="40" class="mr-3">mdi-dumbbell</v-icon>
            <h1 class="text-h4 font-weight-bold text-grey-darken-3">체육관 청소 스케줄 관리</h1>
          </div>
          <p class="text-h6 text-grey-darken-1 font-weight-regular">
            회원 관리 및 청소 스케줄 자동 배정 시스템
          </p>
        </div>
      </v-col>
      <v-col cols="12" lg="10" xl="8">
        <!-- 상단 통계 카드 -->
        <member-statistics />
        <!-- 메인 컨텐츠 카드 -->
        <v-card elevation="2" class="overflow-hidden">
          <v-tabs v-model="activeTab" bg-color="grey-lighten-4" color="primary" grow>
            <v-tab value="members">
              <v-icon class="mr-2">mdi-account-group</v-icon>
              회원 관리
            </v-tab>
            <v-tab value="schedule">
              <v-icon class="mr-2">mdi-calendar-clock</v-icon>
              청소 스케줄
            </v-tab>
          </v-tabs>

          <v-card-text class="pa-6">
            <v-window v-model="activeTab">
              <v-window-item value="members">
                <member-management />
              </v-window-item>

              <v-window-item value="schedule">
                <div class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-2">mdi-calendar-clock</v-icon>
                  <h3 class="text-h6 text-grey mt-4">청소 스케줄 기능</h3>
                  <p class="text-body-2 text-grey mt-2">
                    회원 관리에서 등록된 회원들을 기반으로<br />
                    청소 스케줄을 자동 생성합니다.
                  </p>
                </div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import MemberStatistics from '@/components/members/MemberStatistics.vue';
import MemberManagement from '@/components/members/MemberManagement.vue';

// 활성 탭 상태 관리
const activeTab = ref('members');

// 다이얼로그 상태
const showAddDialog = ref(false);
const editingMember = ref(null);

// 레슨 타입
const lessonTypes = ['월/수 레슨', '화/목 레슨'];

// 회원 데이터
const members = ref([
  {
    id: 1,
    name: '김철수',
    phone: '010-1234-5678',
    email: 'kim@example.com',
    lessonType: '월/수 레슨',
  },
  {
    id: 2,
    name: '이영희',
    phone: '010-9876-5432',
    email: 'lee@example.com',
    lessonType: '화/목 레슨',
  },
  {
    id: 3,
    name: '박민수',
    phone: '010-5555-1234',
    email: 'park@example.com',
    lessonType: '월/수 레슨',
  },
  {
    id: 4,
    name: '최지우',
    phone: '010-7777-8888',
    email: 'choi@example.com',
    lessonType: '화/목 레슨',
  },
  {
    id: 5,
    name: '정하나',
    phone: '010-3333-4444',
    email: 'jung@example.com',
    lessonType: '월/수 레슨',
  },
]);

// 폼 데이터
const memberForm = reactive({
  name: '',
  phone: '',
  email: '',
  lessonType: '',
});

// 레슨 타입에 따른 색상 반환
const getLessonColor = (lessonType) => {
  return lessonType === '월/수 레슨' ? 'blue' : 'green';
};

// 회원 추가/수정
const saveMember = () => {
  if (editingMember.value) {
    // 수정
    const index = members.value.findIndex((m) => m.id === editingMember.value.id);
    if (index !== -1) {
      members.value[index] = {
        ...editingMember.value,
        ...memberForm,
      };
    }
  } else {
    // 추가
    const newId = Math.max(...members.value.map((m) => m.id)) + 1;
    members.value.push({
      id: newId,
      ...memberForm,
    });
  }
  closeDialog();
};

// 회원 수정
const editMember = (member) => {
  editingMember.value = member;
  Object.assign(memberForm, member);
  showAddDialog.value = true;
};

// 회원 삭제
const deleteMember = (id) => {
  if (confirm('정말로 이 회원을 삭제하시겠습니까?')) {
    const index = members.value.findIndex((m) => m.id === id);
    if (index !== -1) {
      members.value.splice(index, 1);
    }
  }
};

// 다이얼로그 닫기
const closeDialog = () => {
  showAddDialog.value = false;
  editingMember.value = null;
  Object.assign(memberForm, {
    name: '',
    phone: '',
    email: '',
    lessonType: '',
  });
};

// 샘플 데이터 내보내기
const exportData = () => {
  console.log('샘플 데이터 내보내기');
};
</script>

<style scoped>
.v-card {
  border-radius: 12px !important;
}

.v-tabs {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.v-tab {
  text-transform: none !important;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.v-window-item {
  padding: 0;
}

.min-height-screen {
  min-height: 100vh;
}

/* 반응형 조정 */
@media (max-width: 600px) {
  .v-card-text {
    padding: 16px !important;
  }
}
</style>
