<template>
  <div class="dish-library">
    <div class="header-section">
      <h2 class="title">菜品库</h2>
      <el-button type="primary" class="add-button" @click="showAddDishDialog">
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

    <!-- 添加菜品对话框 -->
    <el-dialog
      v-model="addDishDialogVisible"
      title="添加菜品"
      width="600px"
      :before-close="handleCloseDialog"
    >
      <el-form
        ref="dishFormRef"
        :model="dishForm"
        :rules="dishFormRules"
        label-width="80px"
        label-position="left"
        class="dish-form"
      >
        <el-form-item label="菜品名称" prop="name">
          <el-input v-model="dishForm.name" placeholder="请输入菜品名称" />
        </el-form-item>
        
        <el-form-item label="菜品分类" prop="category">
          <el-select v-model="dishForm.category" placeholder="请选择菜品分类">
            <el-option label="荤菜" value="荤菜" />
            <el-option label="素菜" value="素菜" />
            <el-option label="汤类" value="汤类" />
            <el-option label="主食" value="主食" />
            <el-option label="甜点" value="甜点" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="热量(卡)" prop="calories">
          <el-input-number v-model="dishForm.calories" :min="0" :max="1000" />
        </el-form-item>
        
        <el-form-item label="时令月份" prop="seasonalMonths">
          <div class="seasonal-months-container">
            <div class="months-display">
              <span v-if="dishForm.seasonalMonths && dishForm.seasonalMonths.length > 0">
                {{ formatSeasonalMonths(dishForm.seasonalMonths) }}
              </span>
              <span v-else class="placeholder-text">请选择时令月份</span>
            </div>
            <el-slider
              v-model="dishForm.seasonalMonths"
              range
              :min="1"
              :max="12"
              :step="1"
              :format-tooltip="formatMonthTooltip"
              @change="onSeasonalMonthsChange"
              class="month-slider"
            />
          </div>
        </el-form-item>
        
        <el-form-item label="菜品图片" prop="image">
          <div class="image-upload-container">
            <el-upload
              class="dish-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeImageUpload"
              :http-request="handleImageUpload"
            >
              <div class="upload-container">
                <img v-if="dishForm.image" :src="dishForm.image" class="dish-image-preview" />
                <div v-else class="upload-placeholder">
                  <el-icon class="upload-icon"><Plus /></el-icon>
                </div>
              </div>
            </el-upload>
            <div class="upload-hint">支持 JPG、PNG 格式，大小不超过 2MB</div>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDialog">取消</el-button>
          <el-button type="primary" @click="submitDishForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from 'element-plus';
import { Search, Plus, Refresh } from '@element-plus/icons-vue';

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

// 添加菜品对话框相关
const addDishDialogVisible = ref(false);
const dishFormRef = ref(null);

// 菜品表单数据
const dishForm = reactive({
  name: '',
  category: '',
  calories: 0,
  seasonalMonths: [], // 改为数组，存储开始和结束月份
  image: ''
});

// 表单验证规则
const dishFormRules = {
  name: [
    { required: true, message: '请输入菜品名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择菜品分类', trigger: 'change' }
  ],
  calories: [
    { required: true, message: '请输入热量值', trigger: 'blur' },
    { type: 'number', min: 0, max: 1000, message: '热量值应在 0-1000 之间', trigger: 'blur' }
  ],
  seasonalMonths: [
    { required: true, message: '请选择时令月份', trigger: 'change' },
    { type: 'array', min: 2, max: 2, message: '请选择月份范围', trigger: 'change' }
  ],
  image: [
    { required: true, message: '请上传菜品图片', trigger: 'change' }
  ]
};

// 显示添加菜品对话框
const showAddDishDialog = () => {
  addDishDialogVisible.value = true;
  // 重置表单
  Object.assign(dishForm, {
    name: '',
    category: '',
    calories: 0,
    seasonalMonths: [3, 9], // 默认选择3月到9月
    image: ''
  });
};

// 关闭对话框
const handleCloseDialog = () => {
  addDishDialogVisible.value = false;
  if (dishFormRef.value) {
    dishFormRef.value.resetFields();
  }
};

// 月份标记
const monthMarks = {
  1: '1月',
  3: '3月',
  6: '6月',
  9: '9月',
  12: '12月'
};

// 格式化月份提示
const formatMonthTooltip = (value) => {
  return `${value}月`;
};

// 格式化时令月份显示
const formatSeasonalMonths = (months) => {
  if (!months || months.length !== 2) return '';
  const [start, end] = months;
  if (start === end) return `${start}月`;
  return `${start}月-${end}月`;
};

// 时令月份变化处理
const onSeasonalMonthsChange = (value) => {
  console.log('选择的月份范围:', value);
};

// 图片上传前的验证
const beforeImageUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error('上传图片只能是 JPG/PNG 格式!');
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!');
  }
  return isJPG && isLt2M;
};

// 处理图片上传（这里使用模拟上传，实际项目中需要替换为真实的上传逻辑）
const handleImageUpload = () => {
  // 模拟上传成功，返回一个随机图片URL
  const mockImageUrl = `https://picsum.photos/seed/${Date.now()}/300/300.jpg`;
  dishForm.image = mockImageUrl;
  ElMessage.success('图片上传成功');
};

// 提交菜品表单
const submitDishForm = () => {
  if (!dishFormRef.value) return;
  
  dishFormRef.value.validate((valid) => {
    if (valid) {
      // 创建新菜品对象
      const newDish = {
        id: Date.now(), // 使用时间戳作为临时ID
        name: dishForm.name,
        category: dishForm.category,
        calories: dishForm.calories.toString(),
        seasonalMonths: [...dishForm.seasonalMonths], // 复制月份数组
        isSeasonal: dishForm.seasonalMonths.length === 2, // 根据是否选择了月份判断是否当季
        image: dishForm.image
      };
      
      // 添加到菜品列表
      allDishList.value.unshift(newDish);
      dishList.value = [...allDishList.value]; // 更新显示列表
      
      ElMessage.success('菜品添加成功!');
      handleCloseDialog();
    } else {
      ElMessage.error('请正确填写表单信息!');
      return false;
    }
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

// 添加菜品对话框样式
:deep(.el-dialog) {
  border-radius: 8px;
  
  .el-dialog__header {
    margin: 0;
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    
    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .el-dialog__body {
    padding: 20px;
  }
  
  .el-dialog__footer {
    padding: 15px 20px;
    border-top: 1px solid #f0f0f0;
    text-align: right;
  }
}

.image-upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.dish-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .el-upload {
    cursor: pointer;
    position: relative;
    width: 178px;
    height: 178px;
  }
  
  .upload-container {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 8px;
    background-color: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    overflow: hidden;
    
    &:hover {
      border-color: #409eff;
      background-color: #f0f9ff;
    }
  }
  
  .upload-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    
    .upload-icon {
      font-size: 32px;
      color: #8c939d;
    }
  }
  
  .dish-image-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.upload-hint {
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
  text-align: center;
  line-height: 1.4;
  width: 220px;
}

.seasonal-months-container {
  width: 100%;
  
  .months-display {
    margin-bottom: 8px;
    min-height: 22px;
    
    span {
      font-size: 14px;
      color: #606266;
    }
    
    .placeholder-text {
      color: #c0c4cc;
    }
  }
  
  .month-slider {
    margin: 16px 0 24px 0;
    width: 100%;
    
    :deep(.el-slider__runway) {
      width: 100%;
    }
  }
}

.dialog-footer {
  text-align: right;
}

:deep(.el-form-item__content) {
  margin-left: 0px !important;
}
</style>
