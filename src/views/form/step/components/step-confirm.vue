<template>
  <a-form
    ref="formRef"
    :model="form"
    :rules="rules"
    class="ele-form-detail"
    :label-col="styleResponsive ? { sm: 5, xs: 24 } : { flex: '130px' }"
    :wrapper-col="styleResponsive ? { sm: 19, xs: 24 } : { flex: '1' }"
  >
    <a-alert
      closable
      show-icon
      type="info"
      message="确认转账后，资金将直接打入对方账户，无法退回。"
    />
    <a-form-item label="付款账户" style="margin-top: 24px">
      {{ data.account }}
    </a-form-item>
    <a-form-item label="收款账户">{{ data.receiver }}</a-form-item>
    <a-form-item label="收款人姓名">{{ data.name }}</a-form-item>
    <a-form-item label="转账金额">
      <span style="font-size: 24px; line-height: 1">
        {{ data.amount }}
      </span>
      元
    </a-form-item>
    <a-divider style="margin: 20px 0 30px 0" />
    <a-form-item label="支付密码" name="password">
      <div style="max-width: 220px">
        <a-input-password
          v-model:value="form.password"
          placeholder="请输入支付密码"
        />
      </div>
    </a-form-item>
    <a-form-item
      :wrapper-col="styleResponsive ? { sm: { offset: 5 } } : { offset: 4 }"
      style="margin-top: 24px"
    >
      <a-space size="middle">
        <a-button type="primary" :loading="loading" @click="submit">
          下一步
        </a-button>
        <a-button @click="back">上一步</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import type { StepForm } from '../model';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  defineProps<{
    data: StepForm;
  }>();

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'back'): void;
  }>();

  //
  const formRef = ref<FormInstance | null>(null);

  // 提交状态
  const loading = ref(false);

  // 表单数据
  const form = reactive({
    password: '123456'
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    password: [
      {
        required: true,
        message: '请输入支付密码',
        type: 'string',
        trigger: 'blur'
      }
    ]
  });

  const submit = () => {
    if (!formRef.value) {
      return;
    }
    formRef.value
      ?.validate()
      .then(() => {
        loading.value = true;
        setTimeout(() => {
          loading.value = false;
          emit('done');
        }, 300);
      })
      .catch(() => {});
  };

  const back = () => {
    emit('back');
  };
</script>
