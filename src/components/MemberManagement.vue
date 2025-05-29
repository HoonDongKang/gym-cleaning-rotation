<template>
  <v-container
    class="fill-height"
    style="display: flex; justify-content: center; align-items: flex-start; padding-top: 2rem"
  >
    <div style="max-width: 1200px; width: 100%">
      <!-- Page Header -->
      <div class="mb-6 text-center">
        <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-2">Member List</h1>
        <p class="text-body-1 text-grey">Manage your gym ㅇ and their lesson schedules.</p>
      </div>

      <excel-btn-group />
      <v-card elevation="1" class="rounded-lg" width="600px">
        <v-data-table
          :headers="headers"
          :items="members"
          :items-per-page="10"
          hide-default-footer
          disable-sort
          class="elevation-0"
          item-key="id"
        >
          <template #item.name="{ item }">
            <div class="py-2">
              <span class="text-body-1 font-weight-medium text-grey-darken-4">
                {{ item.name }}
              </span>
            </div>
          </template>

          <template #item.schedule="{ item }">
            <span v-for="lesson in item.schedule">
              <v-chip
                v-if="lesson"
                :color="getScheduleColor(lesson)"
                variant="tonal"
                size="small"
                class="font-weight-medium"
              >
                {{ lesson === 'lessonMW' ? '월/수 레슨' : '화/목 레슨' }}
              </v-chip>
            </span>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-btn
                variant="text"
                color="primary"
                size="small"
                class="text-none"
                @click="editMember(item)"
              >
                Edit
              </v-btn>

              <v-divider vertical class="mx-1" />

              <v-btn
                variant="text"
                color="error"
                size="small"
                class="text-none"
                @click="confirmDelete(item)"
              >
                Delete
              </v-btn>
            </div>
          </template>

          <template #no-data>
            <div class="text-center py-8">
              <v-icon size="48" color="grey-lighten-1" class="mb-4">
                mdi-account-group-outline
              </v-icon>
              <p class="text-h6 text-grey">회원 목록을 등록해주세요</p>
              <p class="text-body-2 text-grey-lighten-1">
                엑셀 업로드 혹은 추가 버튼을 통해 등록이 가능합니다.
              </p>
            </div>
          </template>
        </v-data-table>
      </v-card>

      <member-dialog @save="addMember">
        <template #activator="props">
          <v-btn
            v-bind="props"
            icon
            color="primary"
            style="position: absolute; bottom: 16px; right: 16px"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
      </member-dialog>
    </div>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import ExcelBtnGroup from './ExcelBtnGroup.vue';
import MemberDialog from './MemberDialog.vue';

const headers = ref([
  {
    title: 'Name',
    key: 'name',
    align: 'start',
    width: '20%',
  },
  {
    title: 'Lesson Schedule',
    key: 'schedule',
    align: 'center',
    width: '60%',
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'center',
    width: '20%',
  },
]);

const members = ref([]);

const deleteDialog = ref(false);
const selectedMember = ref(null);

// Methods
const getScheduleColor = (schedule) => {
  const scheduleColors = {
    lessonMW: 'blue',
    lessonTT: 'green',
  };
  return scheduleColors[schedule];
};

const editMember = (member) => {
  console.log('Editing member:', member);
  // Implement edit functionality
  // Example: open edit dialog or navigate to edit page
};

const confirmDelete = (member) => {
  selectedMember.value = member;
  deleteDialog.value = true;
};

const deleteMember = () => {
  if (selectedMember.value) {
    const index = members.value.findIndex((m) => m.id === selectedMember.value.id);
    if (index > -1) {
      members.value.splice(index, 1);
    }
    console.log('Deleted member:', selectedMember.value.name);
  }
  deleteDialog.value = false;
  selectedMember.value = null;
};

const addMember = (member) => {
  console.log('Adding new member');
  members.value.push(member);
};
</script>

<style scoped>
/* Custom styles if needed */
.v-data-table {
  background-color: transparent;
}

.v-data-table ::v-deep(.v-data-table__td) {
  padding: 16px !important;
}

.v-data-table ::v-deep(.v-data-table__th) {
  padding: 16px !important;
  font-weight: 500 !important;
}

/* Grid 레이아웃 오버라이드 */
.v-container {
  display: flex !important;
  justify-content: center !important;
  align-items: flex-start !important;
}
</style>
