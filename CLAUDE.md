# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**Cooker Assistant**（智能菜单规划系统）是一个基于 Vue 3、TypeScript 和 Element Plus 构建的 Web 应用。该应用帮助用户管理菜品、规划每周菜单、跟踪营养信息，并支持饮食偏好和过敏原限制。

## 开发命令

```bash
# 安装依赖
npm install

# 开发服务器（热重载）
npm run dev

# 类型检查
npm run type-check

# 生产构建（并行运行类型检查和构建）
npm run build

# 仅构建（不进行类型检查）
npm run build-only

# 预览生产构建
npm run preview

# 格式化代码
npm run format
```

## 架构设计

### 技术栈

- **前端框架**: Vue 3 (Composition API)
- **类型系统**: TypeScript
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **构建工具**: Vite
- **HTTP 客户端**: Axios
- **日期处理**: dayjs
- **图表库**: ECharts 5.5.1
- **样式预处理**: SCSS

### 项目结构

```
src/
├── views/
│   ├── mainpage/          # 智能菜单规划（主页）
│   │   ├── index.vue      # 主布局（条件渲染）
│   │   └── components/    # 核心功能模块
│   │       ├── navbar.vue      # 顶部导航栏
│   │       ├── functionbar.vue # 智能规划设置侧边栏
│   │       ├── foodlist.vue    # 菜品库网格
│   │       ├── weekmenu.vue    # 周菜单表格
│   │       └── footer.vue      # 营养统计
│   ├── foodlibrary/       # 食品库管理页面
│   └── weeklymenu/        # 每周菜单管理页面
├── router/
│   └── index.ts           # 路由定义
├── stores/
│   └── counter.ts         # Pinia store（示例）
└── assets/
    ├── global.scss        # 全局样式
    ├── main.css
    └── fonts/             # 自定义图标字体
```

### 路由架构

应用包含三个主要路由：

1. **/** (smartmenu): 智能菜单规划主页
   - 条件渲染 `functionbar`、`foodlist` 和 `weekmenu` 组件
   - 唯一带有智能规划侧边栏的页面

2. **/foodlibrary**: 食品库管理
   - 专门的页面用于浏览和管理食材/菜品
   - 支持搜索、筛选和添加功能

3. **/weeklymenu**: 每周菜单管理
   - 周菜单概览与营养分析
   - 菜单生成和保存功能

### 布局系统

主布局（`mainpage/index.vue`）使用条件渲染：

- **智能菜单路由** (`$route.name === 'smartmenu'`):
  - 显示 `functionbar` 侧边栏（宽度 290px）
  - 在内容区域同时显示 `foodlist` 和 `weekmenu` 组件

- **其他路由** (foodlibrary, weeklymenu):
  - 无侧边栏（全宽内容）
  - 使用 `<router-view>` 渲染页面内容

组件采用 flexbox 布局，支持响应式断点：
- 桌面端: >1200px（最大宽度容器，侧边栏 + 内容）
- 平板端: 768-1200px（较窄的侧边栏）
- 移动端: <768px（垂直堆叠布局）

### 路径别名

项目使用 `@` 作为 `src/` 目录的别名（在 `vite.config.ts` 中配置）：

```typescript
// 推荐写法
import Navbar from '@/views/mainpage/components/navbar.vue'

// 也可以使用相对路径
import Navbar from './components/navbar.vue'
```

### 组件模式

- 组件使用 `<script setup>` 语法（Composition API）
- 带有 `lang="scss"` 的作用域 SCSS 样式
- Element Plus 组件直接导入（在 `main.ts` 中全局注册）
- 使用 SCSS 媒体查询实现响应式设计

### 状态管理

项目使用 Pinia 的 setup store 模式：

```typescript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  return { count, doubleCount, increment }
})
```

## 核心功能

### 1. 智能菜单规划（主页）

主页集成了多个模块：

- **菜品库** (`foodlist.vue`): 网格展示，支持搜索、筛选、分类
- **智能规划设置** (`functionbar.vue`):
  - 营养均衡开关
  - 过敏原过滤（花生、牛奶、鸡蛋、海鲜、坚果）
  - 饮食偏好（无限制、素食、纯素、低脂、低碳水）
  - 季节性食材优先级（低、中、高）
  - 一键生成周菜单
- **周菜单表格** (`weekmenu.vue`): 周一至周日 × 早餐/午餐/晚餐网格
- **营养统计** (`footer.vue`): 总热量、营养成分分析、导出/复制功能

### 2. 食品库管理

专门的页面用于管理食材和菜品，支持搜索和分类。

### 3. 每周菜单管理

概览页面，包含营养分析和菜单生成功能。

## 开发注意事项

### 当前状态

- UI 实现基本完成
- 使用模拟数据（后端 API 对接待完成）
- 用户认证功能尚未实现
- 数据持久化层未完成

### 响应式设计

应用支持三个断点：
- 桌面端 (>1200px): 完整布局，带侧边栏
- 平板端 (768-1200px): 调整间距和较窄的侧边栏
- 移动端 (<768px): 垂直堆叠布局

### 样式约定

- 使用 SCSS 预处理器
- 组件作用域样式使用 `<style lang="scss" scoped>`
- 全局样式位于 `src/assets/global.scss`
- Element Plus 主题色: `#409eff`
- 使用渐变背景和细微阴影增加视觉层次
- 自定义图标字体位于 `src/assets/fonts/`

### 导航模式

导航通过顶部导航栏处理，使用编程式路由：

```javascript
const router = useRouter()
router.push(`/${menu.route}`)
```

菜单项在 `navbar.vue` 中定义，对应相应的路由路径。

## TypeScript 配置

- 通过 `vue-tsc` 使用 Vue 3 TypeScript 支持
- 生产构建前运行类型检查
- 通过 Volar/Vue Language Features 支持 `.vue` 文件类型
