<template>
  <div class="ele-body ele-body-card">
    <a-card title="修改菜单徽章数据" :bordered="false">
      <a-form
        :label-col="styleResponsive ? { sm: 6, xs: 24 } : { flex: '80px' }"
        :wrapper-col="styleResponsive ? { sm: 18, xs: 24 } : { flex: '1' }"
        style="max-width: 360px"
      >
        <a-form-item label="菜单">
          <a-tree-select
            :tree-data="treeData"
            tree-default-expand-all
            placeholder="请选择菜单"
            v-model:value="path"
          />
        </a-form-item>
        <a-form-item label="徽章值">
          <a-input placeholder="请输入徽章值" v-model:value="badge" />
        </a-form-item>
        <a-form-item label="徽章颜色">
          <ele-color-picker
            size="large"
            :show-alpha="true"
            v-model:value="color"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ sm: { offset: 6 } }">
          <a-button type="primary" @click="setBadge">更新</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card title="分组菜单" :bordered="false">
      <div>
        <a-button type="primary" @click="toMenuGroup1">
          一级菜单变为分组形式
        </a-button>
      </div>
      <div style="margin-top: 16px">
        <a-button type="primary" @click="toMenuGroup2">
          二级菜单变为分组形式
        </a-button>
      </div>
      <div class="ele-text-secondary" style="margin-top: 6px">
        二级菜单可查看列表页面/卡片列表的效果
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { message } from 'ant-design-vue/es';
  import { formatTreeData } from 'ele-admin-pro/es';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const userStore = useUserStore();
  const { menus } = storeToRefs(userStore);

  const treeData = computed(() => {
    return formatTreeData(menus.value, (m) => {
      return {
        ...m,
        value: m.path,
        title: m.meta.title
      };
    });
  });

  const path = ref<string>();

  const badge = ref<string>();

  const color = ref<string>();

  const setBadge = () => {
    if (!path.value) {
      message.error('请选择菜单');
      return;
    }
    userStore.setMenuBadge(path.value, badge.value, color.value);
  };

  //
  const orgMenus = JSON.parse(JSON.stringify(menus.value));

  /* 一级菜单变为分组形式 */
  const toMenuGroup1 = () => {
    userStore.setMenus(
      orgMenus.map((m: any) => {
        return {
          ...m,
          meta: {
            ...m.meta,
            group: true
          }
        };
      })
    );
  };

  /* 二级菜单变为分组形式 */
  const toMenuGroup2 = () => {
    userStore.setMenus(
      orgMenus.map((m: any) => {
        return {
          ...m,
          children: m.children
            ? m.children.map((c: any) => {
                return {
                  ...c,
                  meta: {
                    ...c.meta,
                    group: true
                  }
                };
              })
            : void 0
        };
      })
    );
  };
</script>

<script lang="ts">
  export default {
    name: 'ExampleMenuBadge'
  };
</script>
