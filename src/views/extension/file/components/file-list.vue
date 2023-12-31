<!-- 文件展示列表 -->
<template>
  <div class="demo-file-list-group">
    <ele-file-list
      :data="data"
      :grid="grid"
      :sort="sort"
      :order="order"
      :checked="checked"
      :style="{ minHeight: '400px', minWidth: grid ? 'auto' : '456px' }"
      @item-click="onItemClick"
      @sort-change="onSortChange"
      @update:checked="updateChecked"
    >
      <template #context-menu="{ item }">
        <a-menu
          :selectable="false"
          @click="({ key }) => onCtxMenuClick(key, item)"
        >
          <a-menu-item key="open">打开</a-menu-item>
          <a-menu-divider />
          <a-menu-item key="download" v-if="!item.isDirectory">
            <div class="ele-cell">
              <download-outlined />
              <div class="ele-cell-content">下载</div>
            </div>
          </a-menu-item>
          <a-menu-item key="edit">
            <div class="ele-cell">
              <edit-outlined />
              <div class="ele-cell-content">重命名</div>
            </div>
          </a-menu-item>
          <a-menu-item key="move">
            <div class="ele-cell">
              <drag-outlined />
              <div class="ele-cell-content">移动到</div>
            </div>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="remove">
            <div class="ele-cell ele-text-danger">
              <delete-outlined />
              <div class="ele-cell-content">删除</div>
            </div>
          </a-menu-item>
        </a-menu>
      </template>
    </ele-file-list>
    <div v-if="!data.length" class="demo-file-list-empty">
      <a-empty />
    </div>
  </div>
  <!-- 用于图片预览 -->
  <div style="display: none">
    <AImagePreviewGroup v-if="previewOption.visible" :preview="previewOption">
      <AImage
        v-for="item in previewImages"
        :key="String(item.id)"
        :src="item.url"
      />
    </AImagePreviewGroup>
  </div>
  <!-- 文件重命名弹窗 -->
  <name-edit
    v-model:visible="nameEditVisible"
    :data="nameEditData"
    @done="onDone"
  />
</template>

<script lang="ts" setup>
  import { ref, reactive, createVNode } from 'vue';
  import { message, Modal } from 'ant-design-vue/es';
  import {
    DownloadOutlined,
    DragOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
  } from '@ant-design/icons-vue';
  import { messageLoading } from 'ele-admin-pro/es';
  import type {
    FileItem,
    SortValue
  } from 'ele-admin-pro/es/ele-file-list/types';
  import { removeUserFile } from '@/api/system/user-file';
  import type { UserFile } from '@/api/system/user-file/model';
  import NameEdit from './name-edit.vue';

  const props = defineProps<{
    // 父级 id
    parentId?: number;
    // 文件列表数据
    data: FileItem[];
    // 排序字段
    sort?: string;
    // 排序方式
    order?: string;
    // 选中数据
    checked: FileItem[];
    // 是否网格展示
    grid: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'sort-change', value: SortValue): void;
    (e: 'update:checked', value: FileItem[]): void;
    (e: 'go-directory', value: UserFile): void;
    (e: 'done'): void;
  }>();

  // 图片预览配置
  const previewOption = reactive({
    current: 0,
    visible: false,
    onVisibleChange: (visible: boolean) => {
      previewOption.visible = visible;
    }
  });

  // 图片预览列表
  const previewImages = ref<FileItem[]>([]);

  // 文件重命名弹窗是否打开
  const nameEditVisible = ref<boolean>(false);

  // 文件重命名的数据
  const nameEditData = ref<UserFile>();

  /* 文件列表排序方式改变 */
  const onSortChange = (option: SortValue) => {
    emit('sort-change', option);
  };

  /* 更新选中数据 */
  const updateChecked = (value: FileItem[]) => {
    emit('update:checked', value);
  };

  /* item 点击事件 */
  const onItemClick = (item: FileItem) => {
    if (item.isDirectory) {
      // 进入文件夹
      emit('go-directory', item as unknown as UserFile);
    } else if (isImageFile(item)) {
      // 预览图片文件
      previewItemImage(item);
    } else {
      // 选中或取消选中文件
      updateChecked(
        props.checked.includes(item)
          ? props.checked.filter((d) => d !== item)
          : [...props.checked, item]
      );
    }
  };

  /* 右键菜单点击事件 */
  const onCtxMenuClick = (key: any, item: FileItem) => {
    if (key === 'open') {
      // 打开文件
      if (item.isDirectory || isImageFile(item)) {
        onItemClick(item);
      } else {
        window.open(item.url);
      }
    } else if (key === 'download') {
      // 下载文件
      if (typeof item.downloadUrl === 'string') {
        window.open(item.downloadUrl);
      }
    } else if (key === 'edit') {
      // 重命名
      nameEditData.value = item as unknown as UserFile;
      nameEditVisible.value = true;
    } else if (key === 'remove') {
      // 删除文件
      removeItem(item);
    }
  };

  /* 删除 */
  const removeItem = (item: FileItem) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除此文件吗?',
      icon: createVNode(ExclamationCircleOutlined),
      maskClosable: true,
      onOk: () => {
        const hide = messageLoading('请求中..', 0);
        removeUserFile(item.id as number)
          .then((msg) => {
            hide();
            message.success(msg);
            onDone();
          })
          .catch((e) => {
            hide();
            message.error(e.message);
          });
      }
    });
  };

  /* 完成刷新列表数据 */
  const onDone = () => {
    emit('done');
  };

  /* 判断是否是图片文件 */
  const isImageFile = (item: FileItem) => {
    return (
      typeof item.contentType === 'string' &&
      item.contentType.startsWith('image/') &&
      item.url
    );
  };

  /* 预览图片文件 */
  const previewItemImage = (item: FileItem) => {
    previewImages.value = props.data.filter((d) => isImageFile(d));
    const index = previewImages.value.indexOf(item);
    if (index !== -1) {
      previewOption.current = index;
      previewOption.visible = true;
    }
  };
</script>

<style lang="less" scoped>
  .demo-file-list-group {
    position: relative;
    overflow-x: auto;

    .demo-file-list-empty {
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
