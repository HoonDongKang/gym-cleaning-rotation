<template>
  <v-row class="mb-4" justify="space-between" align="center">
    <v-col cols="auto">
      <div class="d-flex align-center">
        <v-btn icon variant="text" @click="previousMonth">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <h2 class="text-h5 font-weight-bold mx-4">
          {{ currentDate.year() }}년 {{ currentDate.month() + 1 }}월
        </h2>

        <v-btn icon variant="text" @click="nextMonth">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </v-col>

    <v-col cols="auto">
      <div class="d-flex gap-2">
        <v-btn
          color="black"
          elevation="0"
          class="mr-2"
          prepend-icon="mdi-refresh"
          @click="generateSchedule"
        >
          스케줄 생성
        </v-btn>

        <v-btn elevation="0" class="mr-2" variant="outlined" prepend-icon="mdi-download">
          내보내기
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';
import { useDayjs } from '@/utils/dayjs';

const emit = defineEmits(['update', 'generate']);

const dayjs = useDayjs();
const currentDate = ref(dayjs());

const previousMonth = () => {
  currentDate.value = currentDate.value.subtract(1, 'month');
};

const nextMonth = () => {
  currentDate.value = currentDate.value.add(1, 'month');
};

const generateSchedule = () => {
  emit('generate');
};

watch(
  currentDate,
  (newDate) => {
    emit('update', newDate);
  },
  { immediate: true },
);
</script>
