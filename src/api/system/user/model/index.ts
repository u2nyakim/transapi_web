import type { PageParam } from '@/api';
import type { Role } from '../../role/model';
import type { Menu } from '../../menu/model';

export interface UserWallet {
  points: number;
  balance: number;
  dollar: number;
}
/**
 * 用户
 */
export interface User {
  // 用户id
  userId?: number;
  // 账号
  username?: string;
  // 密码
  password?: string;
  // 昵称
  nickname?: string;
  // 头像
  avatar?: string;
  // 性别(字典)
  sex?: string;
  // 手机号
  phone?: string;
  // 邮箱
  email?: string;
  // 出生日期
  birthday?: string;
  // 个人简介
  introduction?: string;
  // 机构id
  organizationId?: number;
  // 状态, 0正常, 1冻结
  status?: number;
  // 性别名称
  sexName?: string;
  // 机构名称
  organizationName?: string;
  // 角色列表
  roles?: Role[];
  // 权限列表
  authorities?: Menu[];
  // 创建时间
  createTime?: string;
  // 钱包
  wallet: UserWallet;
}

/**
 * 用户搜索条件
 */
export interface UserParam extends PageParam {
  keywords?: string;
  username?: string;
  nickname?: string;
  sex?: string;
  email?: string;
  phone?: string;
  status?: number;
  organizationId?: number;
  sexName?: string;
}
