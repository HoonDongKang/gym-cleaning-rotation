<template>
  <v-btn class="mr-3" color="primary" href="/sample.xlsx" download>
    <template v-slot:prepend>
      <v-icon>mdi-download</v-icon>
    </template>
    양식 다운로드
  </v-btn>
  <v-btn class="mr-3" color="primary" @click="uploadFile">
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
  <v-btn color="primary" @click="exportFile">
    <template v-slot:prepend>
      <v-icon>mdi-share</v-icon>
    </template>
    회원 목록 다운로드
  </v-btn>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue';
import ExcelJS from 'exceljs';

const emit = defineEmits(['save']);
const props = defineProps(['members']);

const selectedFile = ref(null);
const fileInput = ref(null);
const excelData = ref([]);

const uploadFile = () => {
  fileInput.value.click();
};

const createMember = (data) => {
  if (data.length !== 3) throw new Error('잘못 입력된 회원이 존재합니다.');
  let schedule = [];
  if (data[1] === 'O') schedule.push('lessonMW');
  if (data[2] === 'O') schedule.push('lessonTT');
  return { name: data[0], schedule };
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

    selectedFile.value = null;
  } catch (e) {
    console.error('파일 읽기 오류', e);
  }
};

const exportFile = async () => {
  try {
    console.log(props.members);
    if (!props?.members.length) return;
    const members = props.members;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('회원 목록');

    worksheet.addRow(['이름', '월/수 레슨', '화/목 레슨']);

    members.forEach((member) => {
      worksheet.addRow([
        member.name,
        member.schedule.includes('lessonMW') ? 'O' : 'X',
        member.schedule.includes('lessonTT') ? 'O' : 'X',
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer]);
    const link = document.createElement('a');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    link.href = URL.createObjectURL(blob);
    link.download = `${yyyy}${mm}${dd}_회원목록.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (e) {
    console.error('파일 읽기 오류', e);
  }
};
</script>
