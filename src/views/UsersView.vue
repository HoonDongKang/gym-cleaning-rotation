<template>
  <v-container class="d-flex justify-center" style="width: 500px">
    <v-row no-gutters>
      <v-col cols="12">
        <excel-btn-group />
      </v-col>
      <v-col cols="12">
        <user-data-table />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import ExcelBtnGroup from '@/components/ExcelBtnGroup.vue';
import UserDataTable from '@/components/UserDataTable.vue';
</script>
