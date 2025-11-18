<template>
  <div class="app-container">
    <div class="app-wrapper">
      <navbar class="app-header" />

      <main class="app-main">
        <functionbar v-if="$route.name === 'smartmenu'" class="sidebar" />

        <div class="content-area" :class="{ 'full-width-content': $route.name !== 'smartmenu' }">
          <router-view v-if="$route.name !== 'smartmenu'" class="main-content" />
          <template v-else>
            <foodlist class="food-list-section" />
            <weekmenu
              class="week-menu-section"
              @showDishDetail="handleShowDishDetail"
            />
          </template>
        </div>
      </main>

      <Footer class="app-footer" />
    </div>

    <!-- 菜品详情弹窗 -->
    <DishDetailDialog
      v-model="dishDetailVisible"
      :dish="selectedDish"
    />

    <div class="popper-container"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Foodlist from "./components/foodlist.vue";
import Footer from "./components/footer.vue";
import Functionbar from "./components/functionbar.vue";
import Navbar from "./components/navbar.vue";
import Weekmenu from "./components/weekmenu.vue";
import DishDetailDialog from "./components/DishDetailDialog.vue";

// 菜品详情弹窗控制
const dishDetailVisible = ref(false);
const selectedDish = ref(null);

// 处理显示菜品详情
const handleShowDishDetail = (dish) => {
  selectedDish.value = dish;
  dishDetailVisible.value = true;
};
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  background: transparent;

  .app-wrapper {
    width: 100%;
    min-height: 100vh;
    background: #f9fafb;
    display: flex;
    flex-direction: column;
  }

  .app-header {
    flex: 0 0 60px;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
    background: linear-gradient(transparent, #ffffff);
    z-index: 10;
  }

  .app-main {
    flex: 1;
    display: flex;
    justify-content: center;
    gap: 16px;
    padding: 32px 24px;
    min-height: 0;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .sidebar {
    flex: 0 0 290px;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    padding: 24px;
    background: linear-gradient(transparent, #ffffff);
  }

  // 当没有侧边栏时，内容区域占满整个宽度
  .full-width-content {
    max-width: 1200px;
  }

  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
    max-width: 1200px;
    align-items: stretch; /* 确保子元素拉伸对齐 */
  }

  .food-list-section {
    flex: 1;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    padding: 24px;
    background: linear-gradient(transparent, #ffffff);
    min-height: 0;
    overflow: auto; /* 添加滚动条防止溢出 */
    display: flex;
    flex-direction: column;
  }

  .week-menu-section {
    flex: 0 0 auto;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    padding: 24px;
    background: linear-gradient(transparent, #ffffff);
    width: 100%; /* 确保与菜品库同宽 */
  }

  .main-content {
    width: 100%;
    height: 100%;
  }

  .app-footer {
    flex: 0 0 auto;
    padding: 16px 24px;
    background: #ffffff;
    border-top: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    font-size: 14px;
  }

  .popper-container {
    position: relative;
    z-index: 9999;
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .app-container {
    .app-main {
      padding: 24px 16px;
      gap: 12px;
    }

    .sidebar {
      flex: 0 0 250px;
    }
  }
}

@media (max-width: 768px) {
  .app-container {
    .app-main {
      flex-direction: column;
      padding: 16px 12px;
    }

    .sidebar {
      flex: 0 0 auto;
      width: 100%;
      margin-bottom: 16px;
    }

    .content-area {
      gap: 16px;
      width: 100%; /* 移动端确保宽度充满 */
    }

    .full-width-content {
      max-width: 100%;
    }
    
    .food-list-section,
    .week-menu-section {
      width: 100%; /* 移动端确保两个区域等宽 */
    }
    
    .app-footer {
      padding: 16px 12px;
      text-align: center;
    }
  }
}
</style>
