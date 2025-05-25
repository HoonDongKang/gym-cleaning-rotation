<template>
  <v-app-bar flat color="white" height="80" class="px-6 py-3 shadow-sm rounded-b-xl">
    <!-- 왼쪽 로고 -->
    <v-img :src="cleaningLogo" alt="Cleaning Rotation Logo" />

    <v-spacer></v-spacer>

    <!-- 오른쪽 메뉴 버튼들 -->
    <div class="d-flex align-center gap-4">
      <v-btn variant="text" color="primary" class="text-button">회원 생성</v-btn>
      <v-btn variant="text" color="primary" class="text-button">스케쥴표 생성</v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>
import cleaningLogo from '@/assets/cleaning.png';
</script>

<style scoped>
.shadow-sm {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.rounded-b-xl {
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

.gap-4 {
  gap: 1rem;
}

.text-button {
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.3px;
  text-transform: none;
}
</style>
