<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dish?.name || '菜品详情'"
    width="500px"
    :before-close="handleClose"
    class="dish-detail-dialog"
  >
    <div v-if="dish" class="dish-detail-content">
      <!-- 菜品图片 -->
      <div class="dish-image-wrapper">
        <img :src="dish.image" :alt="dish.name" class="dish-image" />
        <div class="dish-tags-overlay">
          <el-tag
            v-if="dish.isSeasonal"
            type="success"
            size="large"
            effect="dark"
          >
            当季
          </el-tag>
        </div>
      </div>

      <!-- 菜品基本信息 -->
      <div class="dish-info-section">
        <div class="info-row">
          <span class="info-label">分类</span>
          <span class="info-value">{{ dish.category }}</span>
        </div>

        <div class="info-row">
          <span class="info-label">热量</span>
          <span class="info-value calorie-value">{{ dish.calories }} 卡</span>
        </div>

        <div class="info-row" v-if="dish.allergens && dish.allergens.length > 0">
          <span class="info-label">过敏原</span>
          <div class="info-value">
            <el-tag
              v-for="allergen in dish.allergens"
              :key="allergen"
              type="warning"
              size="small"
              class="allergen-tag"
            >
              {{ getAllergenLabel(allergen) }}
            </el-tag>
          </div>
        </div>

        <div class="info-row" v-if="dish.dietType && dish.dietType.length > 0">
          <span class="info-label">饮食类型</span>
          <div class="info-value">
            <el-tag
              v-for="diet in dish.dietType"
              :key="diet"
              type="info"
              size="small"
              class="diet-tag"
            >
              {{ getDietLabel(diet) }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 营养成分（模拟数据）-->
      <div class="nutrition-section">
        <h3 class="section-title">营养成分</h3>
        <div class="nutrition-grid">
          <div class="nutrition-item">
            <span class="nutrition-label">蛋白质</span>
            <span class="nutrition-value">{{ getNutrition('protein') }}g</span>
          </div>
          <div class="nutrition-item">
            <span class="nutrition-label">脂肪</span>
            <span class="nutrition-value">{{ getNutrition('fat') }}g</span>
          </div>
          <div class="nutrition-item">
            <span class="nutrition-label">碳水</span>
            <span class="nutrition-value">{{ getNutrition('carbs') }}g</span>
          </div>
          <div class="nutrition-item">
            <span class="nutrition-label">纤维</span>
            <span class="nutrition-value">{{ getNutrition('fiber') }}g</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleClose">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Dish } from '@/stores/menu';

interface Props {
  modelValue: boolean;
  dish: Dish | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

// 过敏原标签映射
const allergenLabels: Record<string, string> = {
  peanut: '花生',
  milk: '牛奶',
  egg: '鸡蛋',
  seafood: '海鲜',
  nuts: '坚果'
};

// 饮食类型标签映射
const dietLabels: Record<string, string> = {
  unlimited: '无限制',
  vegetarian: '素食',
  vegan: '纯素',
  'low-fat': '低脂',
  'low-carb': '低碳水'
};

const getAllergenLabel = (allergen: string) => {
  return allergenLabels[allergen] || allergen;
};

const getDietLabel = (diet: string) => {
  return dietLabels[diet] || diet;
};

// 模拟营养成分计算（基于热量和分类）
const getNutrition = (type: string) => {
  if (!props.dish) return 0;

  const calories = parseInt(props.dish.calories);
  const category = props.dish.category;

  switch (type) {
    case 'protein':
      if (category === '荤菜') return Math.round(calories * 0.25 / 4);
      if (category === '素菜') return Math.round(calories * 0.15 / 4);
      return Math.round(calories * 0.12 / 4);

    case 'fat':
      if (category === '荤菜') return Math.round(calories * 0.35 / 9);
      if (category === '素菜') return Math.round(calories * 0.20 / 9);
      return Math.round(calories * 0.25 / 9);

    case 'carbs':
      if (category === '主食') return Math.round(calories * 0.60 / 4);
      if (category === '甜点') return Math.round(calories * 0.65 / 4);
      return Math.round(calories * 0.40 / 4);

    case 'fiber':
      if (category === '素菜') return Math.round(calories * 0.08 / 2);
      if (category === '主食') return Math.round(calories * 0.05 / 2);
      return Math.round(calories * 0.03 / 2);

    default:
      return 0;
  }
};

const handleClose = () => {
  dialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.dish-detail-dialog {
  :deep(.el-dialog__header) {
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 24px;

    .el-dialog__title {
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
    }
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }

  :deep(.el-dialog__footer) {
    border-top: 1px solid #f0f0f0;
    padding: 16px 24px;
  }
}

.dish-detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .dish-image-wrapper {
    position: relative;
    width: 100%;
    height: 280px;
    overflow: hidden;
    background-color: #f9fafb;

    .dish-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .dish-tags-overlay {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      gap: 8px;
    }
  }

  .dish-info-section {
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .info-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .info-label {
        font-size: 14px;
        color: #6b7280;
        font-weight: 500;
        min-width: 80px;
      }

      .info-value {
        font-size: 14px;
        color: #1f2937;
        font-weight: 500;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-end;

        &.calorie-value {
          color: #3b82f6;
          font-size: 16px;
          font-weight: 600;
        }
      }

      .allergen-tag,
      .diet-tag {
        margin: 2px;
      }
    }
  }

  .nutrition-section {
    padding: 0 24px 24px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
    }

    .nutrition-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      .nutrition-item {
        background-color: #f9fafb;
        border-radius: 8px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .nutrition-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .nutrition-value {
          font-size: 18px;
          color: #1f2937;
          font-weight: 600;
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
