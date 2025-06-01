<template>
  <v-row class="mb-6">
    <v-col cols="12" md="4">
      <v-card class="pa-4 text-center" elevation="2">
        <div class="d-flex align-center justify-space-between mb-2">
          <span class="text-grey text-body-2">총 회원수</span>
          <v-icon color="grey">mdi-account-group</v-icon>
        </div>
        <div class="text-h4 font-weight-bold text-grey-darken-2">{{ totalMembers }}명</div>
        <div class="text-caption text-grey">등록된 전체 회원</div>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card class="pa-4 text-center" elevation="2">
        <div class="d-flex align-center justify-space-between mb-2">
          <span class="text-grey text-body-2">월/수 레슨 회원</span>
          <v-icon color="blue">mdi-calendar</v-icon>
        </div>
        <div class="text-h4 font-weight-bold text-blue">{{ lessonMW }}명</div>
        <div class="text-caption text-grey">월요일, 수요일 청소 담당</div>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card class="pa-4 text-center" elevation="2">
        <div class="d-flex align-center justify-space-between mb-2">
          <span class="text-grey text-body-2">화/목 레슨 회원</span>
          <v-icon color="green">mdi-calendar</v-icon>
        </div>
        <div class="text-h4 font-weight-bold text-green">{{ lessonTT }}명</div>
        <div class="text-caption text-grey">화요일, 목요일 청소 담당</div>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps(['members']);

const totalMembers = computed(() => props.members.length);

const lessonMW = computed(
  () => props.members.filter((member) => member?.schedule.includes('lessonMW')).length,
);

const lessonTT = computed(
  () => props.members.filter((member) => member?.schedule.includes('lessonTT')).length,
);
</script>
