<template>
  <div class="dish-library">
    <div class="header-section">
      <h2 class="title">菜品库</h2>
      <el-button type="primary" class="add-button">
        <i class="el-icon-plus"></i>
        添加菜品
      </el-button>
    </div>

    <div class="search-section">
      <div class="search-container">
        <el-input
          v-model="searchText"
          placeholder="搜索菜品名称、食材或烹饪方式"
          class="search-input"
          @input="filterDishes"
        >
          <template #prefix>
            <el-icon class="search-icon"><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="selectedCategory"
          placeholder="全部"
          class="category-select"
          @change="filterDishes"
        >
          <el-option label="全部" value="all" />
          <el-option label="荤菜" value="荤菜" />
          <el-option label="素菜" value="素菜" />
          <el-option label="汤类" value="汤类" />
          <el-option label="主食" value="主食" />
          <el-option label="甜点" value="甜点" />
        </el-select>
      </div>
    </div>

    <div class="dish-grid">
      <div v-for="dish in dishList" :key="dish.id" class="dish-card">
        <div class="dish-image-container">
          <img :src="dish.image" :alt="dish.name" class="dish-image" />
          <div class="dish-overlay">
            <span class="dish-name">{{ dish.name }}</span>
          </div>
        </div>

        <div class="dish-info">
          <div class="dish-meta">
            <span class="dish-category">{{ dish.category }}</span>
            <div class="dish-tags">
              <el-tag
                v-if="dish.isSeasonal"
                size="small"
                type="success"
                class="seasonal-tag"
              >
                当季
              </el-tag>
              <el-tag size="small" type="primary" class="calorie-tag">
                {{ dish.calories }}卡
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Search } from '@element-plus/icons-vue';

const searchText = ref("");
const selectedCategory = ref("all");

// 原始菜品数据
const allDishList = ref([
  {
    id: 1,
    name: "番茄炒蛋",
    category: "荤菜",
    calories: "280",
    isSeasonal: true,
    image:
      "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/2cdec50a3c2cb774ba42088ace7d78bc.png",
  },
  {
    id: 2,
    name: "清蒸鲈鱼",
    category: "荤菜",
    calories: "220",
    isSeasonal: true,
    image:
      "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/8f69a1a59a0da534c6b14191a6b3fc18.png",
  },
  {
    id: 3,
    name: "蒜蓉西兰花",
    category: "素菜",
    calories: "120",
    isSeasonal: true,
    image:
      "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/c00cbdf6638cc2bd9b19f4bcc5cc120a.png",
  },
  {
    id: 4,
    name: "紫菜蛋花汤",
    category: "汤类",
    calories: "80",
    isSeasonal: false,
    image:
      "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/2300f84b04badd4a156be9ce8be2d271.png",
  },
  {
    id: 5,
    name: "红烧排骨",
    category: "荤菜",
    calories: "350",
    isSeasonal: false,
    image:
      "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/519634b7d1484d08b9608a289eb7b9bc.png",
  },
  {
    id: 6,
    name: "清炒菠菜",
    category: "素菜",
    calories: "90",
    isSeasonal: true,
    image:
      "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/ecf053e6cbb071d2f27a0ff08145ed01.png",
  },
  {
    id: 7,
    name: "南瓜粥",
    category: "主食",
    calories: "150",
    isSeasonal: true,
    image:
      "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/18e4bff672fb2b2f33f2afee0ff95d2b.png",
  },
  {
    id: 8,
    name: "水果沙拉",
    category: "甜点",
    calories: "180",
    isSeasonal: true,
    image:
      "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/8843f5f841753d805043638c9b4985a5.png",
  },
]);

// 过滤后的菜品列表
const dishList = ref(allDishList.value);

// 过滤菜品的方法
const filterDishes = () => {
  dishList.value = allDishList.value.filter(dish => {
    // 分类过滤
    const categoryMatch = selectedCategory.value === "all" || dish.category === selectedCategory.value;
    
    // 搜索文本过滤
    const searchMatch = !searchText.value || 
      dish.name.toLowerCase().includes(searchText.value.toLowerCase());
    
    return categoryMatch && searchMatch;
  });
};
</script>

<style lang="scss" scoped>
.dish-library {
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

  .header-section {
    width: 100%;
    height: 28px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    row-gap: 0px;
    background: rgba(0, 0, 0, 0);

    .title {
      width: 54px;
      height: 28px;
      background: rgba(0, 0, 0, 0);
      white-space: nowrap;
      color: #1f2937;
      font-family: "Roboto";
      font-size: 18px;
      line-height: 28px;
      font-weight: 600;
      margin: 0;
    }

    .add-button {
      height: 24px;
      border-radius: 3px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      row-gap: 0px;
      padding: 5px 11px;
      background: #409eff;
      border: 1px solid #409eff;

      :deep(.el-icon-plus) {
        width: 0.01px;
        height: 0.01px;
        background: rgba(0, 0, 0, 0);
      }

      :deep(span) {
        color: #ffffff;
        font-family: "Roboto";
        font-size: 12px;
        line-height: 12px;
        font-weight: 500;
        text-align: center;
      }
    }
  }

  .search-section {
    width: 100%;
    margin-bottom: 20px;
    background: rgba(0, 0, 0, 0);

    .search-container {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;

      .search-input {
        flex: 1;
        min-width: 300px;
        max-width: 500px;

        :deep(.el-input__wrapper) {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background-color: #f9fafb;
          transition: all 0.2s ease;
          box-shadow: none;
          
          &.is-focus {
            border-color: #409eff;
            background-color: #ffffff;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          &:hover {
            border-color: #d1d5db;
            background-color: #ffffff;
          }
        }
        
        :deep(.el-input__inner) {
          height: 40px;
          color: #374151;
          font-family: "Roboto";
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
          
          &::placeholder {
            color: #9ca3af;
          }
        }

        :deep(.el-input__prefix) {
          color: #6b7280;
        }

        .search-icon {
          font-size: 16px;
        }
      }

      .category-select {
        width: 120px;

        :deep(.el-input__inner) {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          height: 40px;
          color: #374151;
          font-family: "Roboto";
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
          background-color: #f9fafb;
          transition: all 0.2s ease;
          
          &:focus {
            border-color: #409eff;
            background-color: #ffffff;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            outline: none;
          }
          
          &:hover {
            border-color: #d1d5db;
            background-color: #ffffff;
          }
        }
      }
    }
  }

  .dish-grid {
    width: 100%;
    background: rgba(0, 0, 0, 0);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    overflow: visible;

      .dish-card {
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0);
        border: 1px solid #e5e7eb;
        transition: transform 0.2s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .dish-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          background: rgba(0, 0, 0, 0);

          .dish-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            background-size: cover;
          }

          .dish-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 8px;
            background: linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.7) 0%,
              rgba(0, 0, 0, 0) 100%
            );

            .dish-name {
              color: #ffffff;
              font-family: "Roboto";
              font-size: 14px;
              line-height: 20px;
              font-weight: 500;
            }
          }
        }

        .dish-info {
          padding: 12px;
          background: rgba(0, 0, 0, 0);

          .dish-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .dish-category {
              color: #6b7280;
              font-family: "Roboto";
              font-size: 12px;
              line-height: 16px;
              font-weight: 400;
            }

            .dish-tags {
              display: flex;
              gap: 4px;

              .seasonal-tag {
                border-radius: 4px;
                background: #dcfce7;
                color: #166534;
                font-family: "Roboto";
                font-size: 12px;
                line-height: 16px;
                font-weight: 400;
                border: none;
              }

              .calorie-tag {
                border-radius: 4px;
                background: #dbeafe;
                color: #1e40af;
                font-family: "Roboto";
                font-size: 12px;
                line-height: 16px;
                font-weight: 400;
                border: none;
              }
            }
          }
        }
      }
  }
}
</style>
