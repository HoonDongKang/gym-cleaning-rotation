<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <template #activator="{ props }">
      <slot name="activator" v-bind="props" />
    </template>

    <v-card class="pa-2" elevation="12" rounded="lg">
      <v-card-title class="d-flex align-center justify-space-between px-6 py-4">
        <div class="d-flex align-center">
          <v-icon
            :icon="isEditMode ? 'mdi-account-edit' : 'mdi-account-plus'"
            class="me-3"
            :color="isEditMode ? 'orange' : 'primary'"
            size="28"
          />
          <span class="text-h5 font-weight-medium">
            {{ isEditMode ? '회원 정보 수정' : '새 회원 추가' }}
          </span>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" class="text-grey-600" />
      </v-card-title>

      <v-divider />

      <v-card-text class="px-6 py-6">
        <v-form ref="form" v-model="valid">
          <div class="mb-6">
            <v-text-field
              v-model="formData.name"
              label="이름"
              :rules="nameRules"
              required
              focused
              variant="outlined"
              prepend-inner-icon="mdi-account"
              class="mb-2"
              color="primary"
              hide-details="auto"
            />
          </div>
          <div class="mb-4">
            <v-card variant="outlined" class="pa-4" color="grey-lighten-5">
              <div class="d-flex align-center mb-3">
                <v-icon icon="mdi-calendar-clock" class="me-2" color="primary" />
                <span class="text-subtitle-1 font-weight-medium text-grey-darken-2">
                  레슨 일정 선택
                </span>
              </div>

              <div class="d-flex flex-column gap-2">
                <v-card
                  variant="outlined"
                  :class="[
                    'pa-3 cursor-pointer transition-all',
                    formData.lessonMW
                      ? 'bg-primary-lighten-4 border-primary text-grey-darken-4'
                      : 'hover:bg-grey-lighten-3 text-grey-darken-4',
                  ]"
                  @click="formData.lessonMW = !formData.lessonMW"
                >
                  <div class="d-flex align-center">
                    <v-checkbox
                      v-model="formData.lessonMW"
                      hide-details
                      color="primary"
                      class="me-3"
                      @keydown.enter="formData.lessonMW = !formData.lessonMW"
                    />
                    <div>
                      <div class="font-weight-medium">월/수 레슨</div>
                      <div class="text-caption text-grey-600">매주 월요일, 수요일</div>
                    </div>
                    <v-spacer />
                    <v-chip
                      v-if="formData.lessonMW"
                      size="small"
                      color="primary"
                      variant="elevated"
                    >
                      선택됨
                    </v-chip>
                  </div>
                </v-card>

                <v-card
                  variant="outlined"
                  :class="[
                    'pa-3 cursor-pointer transition-all',
                    formData.lessonTT
                      ? 'bg-primary-lighten-4 border-primary text-grey-darken-4'
                      : 'hover:bg-grey-lighten-3 text-grey-darken-4',
                  ]"
                  @click="formData.lessonTT = !formData.lessonTT"
                >
                  <div class="d-flex align-center">
                    <v-checkbox
                      v-model="formData.lessonTT"
                      hide-details
                      color="primary"
                      class="me-3"
                      @keydown.enter="formData.lessonTT = !formData.lessonTT"
                    />
                    <div>
                      <div class="font-weight-medium">화/목 레슨</div>
                      <div class="text-caption text-grey-600">매주 화요일, 목요일</div>
                    </div>
                    <v-spacer />
                    <v-chip
                      v-if="formData.lessonTT"
                      size="small"
                      color="primary"
                      variant="elevated"
                    >
                      선택됨
                    </v-chip>
                  </div>
                </v-card>
              </div>

              <!-- 선택된 일정 요약 -->
              <v-alert
                v-if="formData.lessonMW || formData.lessonTT"
                type="info"
                variant="tonal"
                class="mt-4"
                density="compact"
              >
                <template #prepend>
                  <v-icon icon="mdi-information" />
                </template>
                선택된 일정:
                <span v-if="formData.lessonMW && formData.lessonTT">월/수, 화/목 레슨</span>
                <span v-else-if="formData.lessonMW">월/수 레슨</span>
                <span v-else-if="formData.lessonTT">화/목 레슨</span>
              </v-alert>
            </v-card>
          </div>
        </v-form>
      </v-card-text>

      <!-- 액션 버튼 -->
      <v-divider />
      <v-card-actions class="px-6 py-4">
        <v-spacer />
        <v-btn variant="outlined" @click="close" class="me-2" prepend-icon="mdi-close">
          취소
        </v-btn>
        <v-btn
          :color="isEditMode ? 'orange' : 'primary'"
          @click="save"
          :disabled="!canSave"
          variant="elevated"
          :prepend-icon="isEditMode ? 'mdi-content-save-edit' : 'mdi-plus'"
        >
          {{ isEditMode ? '수정 완료' : '회원 추가' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, defineProps, watch } from 'vue';

const emit = defineEmits(['save']);
const props = defineProps<{
  member?: {
    _id: number | null;
    name: string;
    schedule?: string[];
  };
}>();

const valid = ref(false);
const form = ref();
const dialog = ref(false);
const isEditMode = computed(() => !!props.member);

const formData = ref({
  name: '',
  lessonMW: false,
  lessonTT: false,
});

const nameRules = [(v: string) => !!v || '이름은 필수입니다.'];
const canSave = computed(() => formData.value.name.trim() !== '');

const resetForm = () => {
  formData.value = {
    name: '',
    lessonMW: false,
    lessonTT: false,
  };
};

const fillForm = () => {
  if (props.member) {
    formData.value.name = props.member.name || '';
    formData.value.lessonMW = props.member.schedule?.includes('lessonMW') ?? false;
    formData.value.lessonTT = props.member.schedule?.includes('lessonTT') ?? false;
  } else {
    resetForm();
  }
};

const save = () => {
  if (!canSave.value) return;

  const memberData = {
    name: formData.value.name.trim(),
    schedule: [
      ...(formData.value.lessonMW ? ['lessonMW'] : []),
      ...(formData.value.lessonTT ? ['lessonTT'] : []),
    ],
    ...(props.member?._id && { _id: props.member._id }),
  };

  emit('save', memberData);
  close();
};

const close = () => {
  dialog.value = false;
  resetForm();
};

watch(dialog, (val) => {
  if (val) fillForm();
});

watch(
  () => props.member,
  () => {
    if (dialog.value) fillForm();
  },
);
</script>
<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.transition-all {
  transition: all 0.2s ease-in-out;
}

.border-primary {
  border-color: rgb(var(--v-theme-primary)) !important;
  border-width: 2px !important;
}

.gap-2 > * + * {
  margin-top: 8px;
}

.hover\:bg-grey-lighten-3:hover {
  background-color: rgb(var(--v-theme-grey-lighten-3));
}
</style>
