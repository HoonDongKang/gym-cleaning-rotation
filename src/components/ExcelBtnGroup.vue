<template>
  <v-btn class="mr-3" color="primary" href="/sample.xlsx" download>
    <template v-slot:prepend>
      <v-icon>mdi-download</v-icon>
    </template>
    양식 다운로드
  </v-btn>
  <v-btn color="primary" @click="uploadFile">
    <template v-slot:prepend>
      <v-icon>mdi-microsoft-excel</v-icon>
    </template>
    엑셀 업로드
    <v-file-input
      ref="fileInput"
      id="file-input"
      v-model="selectedFile"
      @change="handleFileChange"
      style="display: none"
    />
  </v-btn>
</template>

<script setup>
import { ref } from 'vue';

const selectedFile = ref(null);
const fileInput = ref(null);

const uploadFile = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.file[0];
  selectedFile.value = file;
};
</script>
