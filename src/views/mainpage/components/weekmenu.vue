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
          width="110"
          align="center"
        >
          <template #default="{ row }">
            <div class="dish-cell" @click="addDish(row.mealType, day)">
              <div class="dish-placeholder">点击添加菜</div>
              <div class="dish-placeholder">品</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const mealTypes = ["早餐", "午餐", "晚餐"];

const tableData = ref(
  mealTypes.map((mealType) => ({
    mealType,
    ...Object.fromEntries(weekDays.map((day) => [day, ""])),
  })),
);

const addDish = (mealType, day) => {
  console.log(`添加菜品：${mealType} - ${day}`);
  // 这里可以打开菜品选择弹窗等交互逻辑
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
              height: 40px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              cursor: pointer;

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
        }
      }
    }
  }
}
</style>
