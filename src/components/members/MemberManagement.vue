<template>
  <div>
    <excel-btn-group v-bind="{ members }" @saveExcel="addExcelMembers" @saveDialog="handleMember" />
  </div>
  <v-row>
    <v-col cols="12">
      <v-card elevation="1" class="rounded-lg">
        <v-data-table
          :headers="headers"
          :items="pagedMembers"
          :items-per-page="itemsPerPage"
          :loading="loading"
          hide-default-footer
          disable-sort
          class="elevation-0"
          item-key="id"
        >
          <template #item._id="{ item, index }">
            <div class="py-2">
              <span class="text-body-1 font-weight-medium text-grey-darken-4">
                {{ (page - 1) * 10 + index + 1 }}
              </span>
            </div>
          </template>

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
              <member-dialog v-bind="{ member: item }" @save="handleMember">
                <template #activator="props">
                  <v-btn
                    v-bind="props"
                    variant="text"
                    color="primary"
                    size="small"
                    class="text-none"
                  >
                    Edit
                  </v-btn>
                </template>
              </member-dialog>

              <v-divider vertical class="mx-1" />

              <member-delete-dialog v-bind="{ member: item }" @delete="deleteMember">
                <template #activator="props">
                  <v-btn v-bind="props" variant="text" color="error" size="small" class="text-none">
                    Delete
                  </v-btn>
                </template>
              </member-delete-dialog>
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

        <v-pagination v-model="page" :length="length" class="my-4"></v-pagination>
      </v-card>
    </v-col>
  </v-row>

  <!-- <member-dialog v-bind="{ length: members.length }" @save="handleMember">
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
  </member-dialog> -->
</template>

<script setup>
import { ref, defineEmits, computed, watch } from 'vue';
import ExcelBtnGroup from './ExcelBtnGroup.vue';
import MemberDialog from './MemberDialog.vue';
import MemberDeleteDialog from './MemberDeleteDialog.vue';

const emit = defineEmits(['update']);

const headers = ref([
  {
    title: 'Index',
    key: '_id',
    align: 'start',
    width: '10%',
  },
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
const page = ref(1);
const length = ref(Math.floor(members.length / 10) + 1);
let loading = ref(false);
const itemsPerPage = 10;

const pagedMembers = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  return members.value.slice(start, start + itemsPerPage);
});

const generateRandomId = () => {
  return Date.now() + Math.random();
};

const getScheduleColor = (schedule) => {
  const scheduleColors = {
    lessonMW: 'blue',
    lessonTT: 'green',
  };
  return scheduleColors[schedule];
};

const editMember = (member) => {
  const index = members.value.findIndex((m) => m._id === member._id);
  if (index !== -1) {
    members.value[index] = { ...members.value[index], ...member };
  }

  emit('update', members.value);
};

const deleteMember = async (_id) => {
  loading.value = true;

  await new Promise((resolve) => setTimeout(resolve, 100));
  if (_id) {
    const index = members.value.findIndex((m) => m._id === _id);
    if (index > -1) {
      members.value.splice(index, 1);
    }
  }

  emit('update', members.value);

  loading.value = false;
};

const handleMember = (member) => {
  if (!member?._id) {
    addMember({ ...member, _id: generateRandomId() });
  } else {
    editMember(member);
  }
};

const addMember = (member) => {
  members.value.push(member);

  emit('update', members.value);
};

const addExcelMembers = async (excelMembers) => {
  loading.value = true;

  await new Promise((resolve) => setTimeout(resolve, 100));
  members.value = [...members.value, ...excelMembers].map((member, i) => ({
    ...member,
    _id: generateRandomId(),
  }));

  emit('update', members.value);

  loading.value = false;
};

watch(
  () => members.value.length,
  (newLength) => {
    length.value = Math.ceil(newLength / itemsPerPage);
    if (page.value > length.value) {
      page.value = length.value || 1;
    }
  },
  { immediate: true },
);
</script>

<style scoped>
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
