<template>
  <div class="header-container">
    <div class="header-content">
      <div class="logo-section">
        <i class="logo-icon"></i>
        <h1 class="system-title">每日菜单管理系统</h1>
      </div>
      <nav class="navigation-menu">
        <div
          v-for="(menu, index) in menuItems"
          :key="index"
          class="menu-item"
          :class="`menu-item-${index}`"
        >
          <span class="menu-text">{{ menu.text }}</span>
        </div>
      </nav>
      <div class="login-section">
        <el-button type="primary" class="login-button">
          <i class="button-icon"></i>
          <span class="button-text">登录</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElButton } from "element-plus";

const menuItems = [
  { text: "菜品管理" },
  { text: "智能菜单规划" },
  { text: "本周菜单" },
  { text: "历史菜单" },
];
</script>

<style lang="scss" scoped>
.header-container {
  position: relative;
  height: 60px;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  background: linear-gradient(rgba(0, 0, 0, 0)), rgba(255, 255, 255, 1);

  .header-content {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    margin: 0 auto;
    max-width: 1280px;

    .logo-section {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 28px;

      .logo-icon {
        width: 0.01px;
        height: 0.01px;
        background: rgba(0, 0, 0, 0);
      }

      .system-title {
        white-space: nowrap;
        color: #1f2937;
        font-family: "Roboto";
        font-size: 20px;
        line-height: 28px;
        font-weight: 700;
        margin: 0;
      }
    }

    .navigation-menu {
      display: flex;
      align-items: center;
      gap: 32px;
      height: 24px;

      .menu-item {
        .menu-text {
          white-space: nowrap;
          color: #374151;
          font-family: "Roboto";
          font-size: 16px;
          line-height: 24px;
          font-weight: 500;
          cursor: pointer;

          &:hover {
            color: #409eff;
          }
        }
      }
    }

    .login-section {
      .login-button {
        padding: 5px 11px;
        height: 24px;
        border-radius: 3px;

        .button-icon {
          width: 0.01px;
          height: 0.01px;
          background: rgba(0, 0, 0, 0);
          margin-right: 4px;
        }

        .button-text {
          color: #ffffff;
          font-family: "Roboto";
          font-size: 12px;
          line-height: 12px;
          font-weight: 500;
        }
      }
    }
  }
}

:deep(.el-button) {
  border: 1px solid #409eff;
}
</style>
