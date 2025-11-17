<template>
  <div class="nutrition-footer">
    <div class="footer-content">
      <div class="footer-layout">
        <div class="nutrition-info">
          <div class="calorie-info">
            <i></i>
            <span class="info-text">
              <div class="text-content">总热量: 0 卡</div>
            </span>
          </div>
          <div class="nutrient-breakdown">
            <i></i>
            <span class="info-text">
              <div class="text-content">蛋白质: 0%</div>
            </span>
            <span class="info-text">
              <div class="text-content">碳水: 0%</div>
            </span>
            <span class="info-text">
              <div class="text-content">脂肪: 0%</div>
            </span>
          </div>
        </div>
        <div class="action-buttons">
          <el-button class="secondary-button">
            <span class="button-content">
              <i></i>
              <div class="button-text">复制到下周</div>
            </span>
          </el-button>
          <el-button type="primary" class="primary-button">
            <span class="button-content">
              <i></i>
              <div class="button-text">导出SVG菜单</div>
            </span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElButton } from "element-plus";
</script>

<style lang="scss" scoped>
.nutrition-footer {
  position: relative;
  height: 57px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 10px;
  padding: 16px 0px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;

  .footer-content {
    width: 100%;
    height: 24px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    flex-wrap: wrap;
    row-gap: 10px;
    column-gap: 10px;
    padding: 0px 24px;
    background: transparent;

    .footer-layout {
      width: 100%;
      height: 24px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      background: transparent;

      .nutrition-info {
        height: 20px;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        flex-wrap: wrap;
        row-gap: 0px;
        background: transparent;

        .calorie-info {
          height: 20px;
          display: flex;
          flex-direction: row;
          justify-content: start;
          align-items: center;
          flex-wrap: wrap;
          row-gap: 0px;
          background: transparent;
          margin-right: 24px;

          i {
            width: 0.01px;
            height: 0.01px;
            background: transparent;
            margin-right: 8px;
          }

          .info-text {
            height: 20px;
            background: transparent;

            .text-content {
              height: 20px;
              white-space: nowrap;
              color: #000000;
              font-family: "Roboto";
              font-size: 14px;
              line-height: 20px;
              font-weight: 400;
            }
          }
        }

        .nutrient-breakdown {
          height: 20px;
          display: flex;
          flex-direction: row;
          justify-content: start;
          align-items: center;
          flex-wrap: wrap;
          row-gap: 0px;
          background: transparent;

          i {
            width: 0.01px;
            height: 0.01px;
            background: transparent;
            margin-right: 8px;
          }

          .info-text {
            height: 20px;
            background: transparent;
            margin-right: 16px;

            &:last-child {
              margin-right: 0;
            }

            .text-content {
              height: 20px;
              white-space: nowrap;
              color: #000000;
              font-family: "Roboto";
              font-size: 14px;
              line-height: 20px;
              font-weight: 400;
            }
          }
        }
      }

      .action-buttons {
        height: 24px;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        flex-wrap: wrap;
        row-gap: 0px;
        background: transparent;
        gap: 16px;

        .secondary-button,
        .primary-button {
          height: 24px;
          border-radius: 3px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          row-gap: 0px;
          padding: 5px 11px;

          :deep(.button-content) {
            height: 12px;
            display: flex;
            flex-direction: row;
            justify-content: start;
            align-items: center;
            flex-wrap: wrap;
            row-gap: 0px;
            background: transparent;

            i {
              width: 0.01px;
              height: 0.01px;
              background: transparent;
              margin-right: 4px;
            }

            .button-text {
              height: 12px;
              white-space: nowrap;
              font-family: "Roboto";
              font-size: 12px;
              line-height: 12px;
              font-weight: 500;
              text-align: center;
            }
          }
        }

        .secondary-button {
          background: #ffffff;
          border: 1px solid #dcdfe6;

          :deep(.button-content .button-text) {
            color: #606266;
          }
        }

        .primary-button {
          background: #409eff;
          border: 1px solid #409eff;

          :deep(.button-content .button-text) {
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
