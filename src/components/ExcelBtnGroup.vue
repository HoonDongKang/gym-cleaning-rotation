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
import { ref, defineEmits } from 'vue';
import ExcelJS from 'exceljs';

const selectedFile = ref(null);
const fileInput = ref(null);
const excelData = ref([]);
const emit = defineEmits('save');

const uploadFile = () => {
  fileInput.value.click();
};

const createMember = (data) => {
  if (data.length !== 4) throw new Error('잘못 입력된 회원이 존재합니다.');

  let schedule = [];
  if (data[2] === 'O') schedule.push('lessonMW');
  if (data[3] === 'O') schedule.push('lessonTT');
  return { _id: data[0], name: data[1], schedule };
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  selectedFile.value = file;

  try {
    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);

    const workSheet = workbook.getWorksheet(1);
    const data = [];

    workSheet.eachRow((row, rowNumber) => {
      const rowData = [];
      row.eachCell((cell, colNumber) => {
        rowData.push(cell.value);
      });
      if (rowNumber !== 1) {
        data.push(createMember(rowData));
      }
    });

    excelData.value = data;
    emit('save', excelData.value);
  } catch (e) {
    console.error('파일 읽기 오류', e);
  }
};
</script>
