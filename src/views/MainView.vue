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
        <member-statistics v-bind="{ members }" />

        <v-card elevation="2" class="overflow-hidden" min-width="700px">
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
                <member-management @update="updateMembers" />
              </v-window-item>

              <v-window-item value="schedule">
                <schedule-management />
                <!-- <div class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-2">mdi-calendar-clock</v-icon>
                  <h3 class="text-h6 text-grey mt-4">청소 스케줄 기능</h3>
                  <p class="text-body-2 text-grey mt-2">
                    회원 관리에서 등록된 회원들을 기반으로<br />
                    청소 스케줄을 자동 생성합니다.
                  </p>
                </div> -->
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
import ScheduleManagement from '@/components/schedules/ScheduleManagement.vue';

// 활성 탭 상태 관리
const activeTab = ref('members');
const members = ref([]);

const updateMembers = (payload) => {
  members.value = [...payload];
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
