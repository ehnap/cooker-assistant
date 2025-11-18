<template>
  <div class="week-menu-container">
    <div class="menu-header">
      <h2 class="menu-title">本周菜单</h2>
      <div class="action-buttons">
        <el-button class="draft-button" type="default" size="small">
          <i></i>
          <span>保存草稿</span>
        </el-button>
        <el-button class="publish-button" type="primary" size="small">
          <i></i>
          <span>发布正式版</span>
        </el-button>
      </div>
    </div>

    <div class="menu-table-wrapper">
      <el-table class="menu-table" :data="tableData" border style="width: 100%">
        <el-table-column prop="mealType" label="" width="96" align="center">
          <template #default="{ row }">
            <div class="meal-type-cell">{{ row.mealType }}</div>
          </template>
        </el-table-column>

        <el-table-column
          v-for="day in weekDays"
          :key="day"
          :label="day"
          :prop="day"
          min-width="180"
          align="center"
        >
          <template #default="{ row }">
            <div class="dish-cell" @click="handleCellClick(row.mealType, day)">
              <template v-if="getDishes(row.mealType, day).length > 0">
                <div
                  v-for="(dish, index) in getDishes(row.mealType, day)"
                  :key="dish.id"
                  class="dish-item"
                  @click.stop="handleDishClick(dish)"
                >
                  <div class="dish-icon">{{ dish.icon || '🍽️' }}</div>
                  <span class="dish-name">{{ dish.name }}</span>
                </div>
              </template>
              <template v-else>
                <div class="dish-placeholder">点击添加菜</div>
                <div class="dish-placeholder">品</div>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMenuStore } from "@/stores/menu";

const menuStore = useMenuStore();

const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const mealTypes = ["早餐", "午餐", "晚餐"];

// 定义发射事件（用于和父组件通信）
const emit = defineEmits(['showDishDetail']);

const tableData = ref(
  mealTypes.map((mealType) => ({
    mealType,
    ...Object.fromEntries(weekDays.map((day) => [day, ""])),
  })),
);

// 获取指定位置的菜品列表
const getDishes = (mealType, day) => {
  return menuStore.weekMenu[mealType]?.[day] || [];
};

// 处理菜品点击事件
const handleDishClick = (dish) => {
  emit('showDishDetail', dish);
};

// 处理单元格点击事件（添加菜品）
const handleCellClick = (mealType, day) => {
  // 这里可以打开菜品选择弹窗等交互逻辑
};

// 获取菜品颜色类
const getDishColorClass = (index) => {
  const colorClasses = ['dish-color-1', 'dish-color-2', 'dish-color-3', 'dish-color-4'];
  return colorClasses[index % colorClasses.length];
};
</script>

<style lang="scss" scoped>
.week-menu-container {
  position: relative;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 10px;
  padding: 24px;
  background: linear-gradient(rgba(0, 0, 0, 0)), rgba(255, 255, 255, 1);

  .menu-header {
    width: 100%;
    height: 28px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    row-gap: 0px;
    background: rgba(0, 0, 0, 0);
    margin-bottom: 16px;

    .menu-title {
      width: 72px;
      height: 28px;
      white-space: nowrap;
      color: #1f2937;
      font-family: "Roboto";
      font-size: 18px;
      line-height: 28px;
      font-weight: 600;
      margin: 0;
    }

    .action-buttons {
      display: flex;
      flex-direction: row;
      justify-content: start;
      align-items: start;
      flex-wrap: wrap;
      row-gap: 0px;
      gap: 8px;
      background: rgba(0, 0, 0, 0);

      .draft-button {
        border-radius: 3px;
        padding: 5px 11px;
        background: #ffffff;
        border: 1px solid #dcdfe6;

        span {
          color: #606266;
          font-family: "Roboto";
          font-size: 12px;
          line-height: 12px;
          font-weight: 500;
          text-align: center;
        }
      }

      .publish-button {
        border-radius: 3px;
        padding: 5px 11px;
        background: #409eff;
        border: 1px solid #409eff;

        span {
          color: #ffffff;
          font-family: "Roboto";
          font-size: 12px;
          line-height: 12px;
          font-weight: 500;
          text-align: center;
        }
      }
    }
  }

  .menu-table-wrapper {
    width: 100%;
    overflow: hidden;
    background: rgba(0, 0, 0, 0);

    .menu-table {
      :deep(.el-table__header) {
        .el-table__cell {
          background: rgba(0, 0, 0, 0);
          border-bottom: 1px solid #e5e7eb;
          padding: 8px 16px;

          .cell {
            color: #374151;
            font-family: "Roboto";
            font-size: 16px;
            line-height: 24px;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
        }

        // 列背景色 - 表头
        .el-table__cell:nth-child(2) { background: #fef2f2 !important; } // 周一 - 淡粉
        .el-table__cell:nth-child(3) { background: #fefce8 !important; } // 周二 - 淡黄
        .el-table__cell:nth-child(4) { background: #eff6ff !important; } // 周三 - 淡蓝
        .el-table__cell:nth-child(5) { background: #ecfdf5 !important; } // 周四 - 淡绿
        .el-table__cell:nth-child(6) { background: #fff7ed !important; } // 周五 - 淡橙
        .el-table__cell:nth-child(7) { background: #faf5ff !important; } // 周六 - 淡紫
        .el-table__cell:nth-child(8) { background: #f9fafb !important; } // 周日 - 淡灰
      }

      :deep(.el-table__body) {
        .el-table__row {
          .el-table__cell {
            background: rgba(0, 0, 0, 0);
            border-bottom: 1px solid #e5e7eb;
            padding: 12px 16px;

            .meal-type-cell {
              color: #374151;
              font-family: "Roboto";
              font-size: 16px;
              line-height: 24px;
              font-weight: 500;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
            }

            .dish-cell {
              width: 100%;
              min-height: 100px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              cursor: pointer;
              padding: 8px 6px;
              gap: 6px;

              .dish-item {
                width: 100%;
                padding: 6px 8px;
                border-radius: 6px;
                transition: all 0.2s ease;
                cursor: pointer;
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 6px;
                background: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(0, 0, 0, 0.06);

                &:hover {
                  transform: translateY(-1px);
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
                  background: #ffffff;
                }

                .dish-icon {
                  width: 24px;
                  height: 24px;
                  font-size: 18px;
                  line-height: 24px;
                  text-align: center;
                  flex-shrink: 0;
                }

                .dish-name {
                  color: #1f2937;
                  font-family: "Roboto";
                  font-size: 12px;
                  line-height: 18px;
                  font-weight: 500;
                  flex: 1;
                  min-width: 0;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }

              .dish-placeholder {
                color: #9ca3af;
                font-family: "Roboto";
                font-size: 14px;
                line-height: 20px;
                font-weight: 400;
                text-align: center;
              }
            }
          }

          // 列背景色 - 数据行
          .el-table__cell:nth-child(2) { background: #fef2f2 !important; } // 周一 - 淡粉
          .el-table__cell:nth-child(3) { background: #fefce8 !important; } // 周二 - 淡黄
          .el-table__cell:nth-child(4) { background: #eff6ff !important; } // 周三 - 淡蓝
          .el-table__cell:nth-child(5) { background: #ecfdf5 !important; } // 周四 - 淡绿
          .el-table__cell:nth-child(6) { background: #fff7ed !important; } // 周五 - 淡橙
          .el-table__cell:nth-child(7) { background: #faf5ff !important; } // 周六 - 淡紫
          .el-table__cell:nth-child(8) { background: #f9fafb !important; } // 周日 - 淡灰
        }
      }
    }
  }
}
</style>
