<template>
  <div class="smart-planning-settings">
    <div class="settings-header">
      <h2>智能规划设置</h2>
    </div>
    <div class="settings-content">
      <!-- 营养均衡开关 -->
      <div class="setting-item">
        <div class="setting-label">
          <h3>营养均衡</h3>
        </div>
        <div class="switch-container">
          <el-switch
            v-model="nutritionBalance"
            active-text="开启"
            inactive-text="关闭"
            active-color="#409eff"
          />
        </div>
      </div>

      <!-- 过敏原过滤 -->
      <div class="setting-item">
        <div class="setting-label">
          <h3>过敏原过滤</h3>
        </div>
        <div class="select-container">
          <el-select v-model="allergens" placeholder="选择过敏原" clearable multiple>
            <el-option
              v-for="allergen in allergenOptions"
              :key="allergen.value"
              :label="allergen.label"
              :value="allergen.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 饮食偏好 -->
      <div class="setting-item">
        <div class="setting-label">
          <h3>饮食偏好</h3>
        </div>
        <div class="select-container">
          <el-select v-model="dietPreference" placeholder="无限制" clearable>
            <el-option
              v-for="preference in dietPreferenceOptions"
              :key="preference.value"
              :label="preference.label"
              :value="preference.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 季节性食材优先级 -->
      <div class="setting-item">
        <div class="setting-label">
          <h3>季节性食材优先级</h3>
        </div>
        <div class="slider-container">
          <el-slider
            v-model="seasonalPriority"
            :min="1"
            :max="3"
            :marks="{
              1: { label: '低', position: 0 },
              2: { label: '中', position: 50 },
              3: { label: '高', position: 100 }
            }"
            show-stops
            :format-tooltip="formatPriorityTooltip"
          />
        </div>
      </div>

      <!-- 生成按钮 -->
      <div class="generate-button">
        <el-button type="primary" @click="generateMenu">
          <i></i>
          一键生成本周菜单
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useMenuStore } from "@/stores/menu";
import { ElMessage } from "element-plus";

const menuStore = useMenuStore();

// 响应式数据
const nutritionBalance = ref(true);
const allergens = ref([]);
const dietPreference = ref("");
const seasonalPriority = ref(2);

// 选项数据
const allergenOptions = ref([
  { label: "花生", value: "peanut" },
  { label: "牛奶", value: "milk" },
  { label: "鸡蛋", value: "egg" },
  { label: "海鲜", value: "seafood" },
  { label: "坚果", value: "nuts" },
]);

const dietPreferenceOptions = ref([
  { label: "无限制", value: "unlimited" },
  { label: "素食", value: "vegetarian" },
  { label: "纯素", value: "vegan" },
  { label: "低脂", value: "low-fat" },
  { label: "低碳水", value: "low-carb" },
]);

// 格式化滑块提示文本
const formatPriorityTooltip = (value: number) => {
  const priorityLabels: Record<number, string> = {
    1: "低",
    2: "中",
    3: "高"
  };
  return priorityLabels[value] || value;
};

// 生成菜单方法
const generateMenu = () => {
  const settings = {
    nutritionBalance: nutritionBalance.value,
    allergens: allergens.value,
    dietPreference: dietPreference.value,
    seasonalPriority: seasonalPriority.value,
  };

  try {
    // 先清空旧菜单，确保数据结构正确
    menuStore.clearWeekMenu();

    // 调用 store 生成菜单
    menuStore.generateWeekMenu(settings);

    ElMessage.success("周菜单生成成功！");
  } catch (error) {
    console.error("生成菜单失败:", error);
    ElMessage.error("生成菜单失败，请检查设置后重试");
  }
};
</script>

<style lang="scss" scoped>
.smart-planning-settings {
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

  .settings-header {
    width: 100%;
    margin-bottom: 20px;

    h2 {
      white-space: nowrap;
      color: #1f2937;
      font-family: "Roboto";
      font-size: 18px;
      line-height: 28px;
      font-weight: 600;
      margin: 0;
    }
  }

  .settings-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .setting-item {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .setting-label {
        h3 {
          white-space: nowrap;
          color: #374151;
          font-family: "Roboto";
          font-size: 14px;
          line-height: 20px;
          font-weight: 500;
          margin: 0;
        }
      }

      .switch-container,
      .select-container,
      .slider-container {
        :deep(.el-switch) {
          &.is-checked {
            .el-switch__core {
              border-color: #409eff;
              background-color: #409eff;
            }
          }
        }

        :deep(.el-select) {
          width: 100%;

          .el-input__inner {
            color: #606266;
            font-family: "Roboto";
            font-size: 14px;
          }

          .el-select__caret {
            color: #a8abb2;
          }
        }

        :deep(.el-slider) {
          margin: 24px 0 16px 0;
          width: 100%;
          
          .el-slider__runway {
            width: 100%;
            background-color: #e4e7ed;

            .el-slider__bar {
              background-color: #409eff;
            }

            .el-slider__stop {
              background-color: #ffffff;
            }
          }

          .el-slider__marks {
            width: 100%;
            top: 10px;
            left: 0;
            right: 0;
            
            .el-slider__marks-text {
              color: #909399;
              font-family: "Roboto";
              font-size: 14px;
              white-space: nowrap;
              transform: translateX(-50%);
              position: absolute;
            }
          }

          .el-slider__button {
            border: 2px solid #409eff;
          }
        }
      }
    }

    .generate-button {
      :deep(.el-button) {
        width: 100%;
        background: #409eff;
        border: 1px solid #409eff;
        border-radius: 4px;
        padding: 8px 15px;

        span {
          color: #ffffff;
          font-family: "Roboto";
          font-size: 14px;
          line-height: 14px;
          font-weight: 500;
          text-align: center;
        }

        &:hover {
          background: #66b1ff;
          border-color: #66b1ff;
        }
      }
    }
  }
}
</style>
