import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { AiModel, AiModelParam } from './model';

/**
 * 分页查询模型
 */
export async function pageAiModels(params: AiModelParam) {
  const res = await request.get<ApiResult<PageResult<AiModel>>>(
    '/openai/ai-model/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询模型列表
 */
export async function listAiModels(params?: AiModelParam) {
  const res = await request.get<ApiResult<AiModel[]>>('/openai/ai-model', {
    params
  });
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 根据id查询模型
 */
export async function getAiModel(id: number) {
  const res = await request.get<ApiResult<AiModel>>('/openai/ai-model/' + id);
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加模型
 */
export async function addAiModel(data: AiModel) {
  const res = await request.post<ApiResult<unknown>>('/openai/ai-model/', data);
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改模型
 */
export async function updateAiModel(data: AiModel) {
  const res = await request.put<ApiResult<unknown>>('/openai/ai-model/', data);
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除模型
 */
export async function removeAiModel(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    '/openai/ai-model/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除模型
 */
export async function removeAiModels(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    '/openai/ai-model/batch',
    {
      data
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改模型状态
 */
export async function updateAiModelStatus(userId?: number, status?: boolean) {
  const res = await request.put<ApiResult<unknown>>('/openai/ai-model/status', {
    userId,
    status
  });
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 检查模型是否存在
 */
export async function checkExistence(
  field: string,
  value: string,
  id?: number
) {
  const res = await request.get<ApiResult<unknown>>(
    '/openai/ai-model/existence',
    {
      params: { field, value, id }
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询模型支持
 */
export async function modelsCheck(host: string, sk: string) {
  const res = await request.post<ApiResult<unknown>>('/openai/ai-model/check', {
    host,
    sk
  });
  if (res.data.code === 0) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.message));
}
