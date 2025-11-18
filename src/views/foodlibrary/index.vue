<template>
  <div class="food-library">
    <div class="header-section">
      <h2 class="title">食品库</h2>
      <el-button type="primary" class="add-button" @click="showAddIngredientDialog">
        <i class="el-icon-plus"></i>
        添加食材
      </el-button>
    </div>

    <div class="search-section">
      <div class="search-container">
        <el-input
          v-model="searchText"
          placeholder="搜索食材名称"
          class="search-input"
          @input="filterIngredients"
        >
          <template #prefix>
            <el-icon class="search-icon"><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="selectedCategory"
          placeholder="全部"
          class="category-select"
          @change="filterIngredients"
        >
          <el-option label="全部" value="all" />
          <el-option label="肉类" value="肉类" />
          <el-option label="蔬菜" value="蔬菜" />
          <el-option label="水果" value="水果" />
          <el-option label="海鲜" value="海鲜" />
          <el-option label="豆制品" value="豆制品" />
          <el-option label="调味品" value="调味品" />
          <el-option label="主食" value="主食" />
        </el-select>
      </div>
    </div>

    <div class="ingredient-grid">
      <div v-for="ingredient in ingredientList" :key="ingredient.id" class="ingredient-card">
        <div class="ingredient-image-container">
          <img :src="ingredient.image" :alt="ingredient.name" class="ingredient-image" />
          <div class="ingredient-overlay">
            <span class="ingredient-name">{{ ingredient.name }}</span>
          </div>
        </div>

        <div class="ingredient-info">
          <div class="ingredient-meta">
            <span class="ingredient-category">{{ ingredient.category }}</span>
            <div class="ingredient-tags">
              <el-tag
                v-if="ingredient.isSeasonal"
                size="small"
                type="success"
                class="seasonal-tag"
              >
                当季
              </el-tag>
              <el-tag size="small" type="primary" class="calorie-tag">
                {{ ingredient.calories }}卡/100g
              </el-tag>
            </div>
          </div>
          <div class="ingredient-nutrients">
            <span class="nutrient-item">蛋白质: {{ ingredient.protein }}g</span>
            <span class="nutrient-item">脂肪: {{ ingredient.fat }}g</span>
            <span class="nutrient-item">碳水: {{ ingredient.carbs }}g</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加食材对话框 -->
    <el-dialog
      v-model="addIngredientDialogVisible"
      title="添加食材"
      width="600px"
      :before-close="handleCloseDialog"
    >
      <el-form
        ref="ingredientFormRef"
        :model="ingredientForm"
        :rules="ingredientFormRules"
        label-width="80px"
        label-position="left"
        class="ingredient-form"
      >
        <el-form-item label="食材名称" prop="name">
          <el-input v-model="ingredientForm.name" placeholder="请输入食材名称" />
        </el-form-item>
        
        <el-form-item label="食材分类" prop="category">
          <el-select v-model="ingredientForm.category" placeholder="请选择食材分类">
            <el-option label="肉类" value="肉类" />
            <el-option label="蔬菜" value="蔬菜" />
            <el-option label="水果" value="水果" />
            <el-option label="海鲜" value="海鲜" />
            <el-option label="豆制品" value="豆制品" />
            <el-option label="调味品" value="调味品" />
            <el-option label="主食" value="主食" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="热量(卡/100g)" prop="calories">
          <el-input-number v-model="ingredientForm.calories" :min="0" :max="1000" />
        </el-form-item>
        
        <el-form-item label="蛋白质(g/100g)" prop="protein">
          <el-input-number v-model="ingredientForm.protein" :min="0" :max="100" />
        </el-form-item>
        
        <el-form-item label="脂肪(g/100g)" prop="fat">
          <el-input-number v-model="ingredientForm.fat" :min="0" :max="100" />
        </el-form-item>
        
        <el-form-item label="碳水(g/100g)" prop="carbs">
          <el-input-number v-model="ingredientForm.carbs" :min="0" :max="100" />
        </el-form-item>
        
        <el-form-item label="时令月份" prop="seasonalMonths">
          <div class="seasonal-months-container">
            <div class="months-display">
              <span v-if="ingredientForm.seasonalMonths && ingredientForm.seasonalMonths.length > 0">
                {{ formatSeasonalMonths(ingredientForm.seasonalMonths) }}
              </span>
              <span v-else class="placeholder-text">请选择时令月份</span>
            </div>
            <el-slider
              v-model="ingredientForm.seasonalMonths"
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
        
        <el-form-item label="食材图片" prop="image">
          <div class="image-upload-container">
            <el-upload
              class="ingredient-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeImageUpload"
              :http-request="handleImageUpload"
            >
              <div class="upload-container">
                <img v-if="ingredientForm.image" :src="ingredientForm.image" class="ingredient-image-preview" />
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
          <el-button type="primary" @click="submitIngredientForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Plus } from '@element-plus/icons-vue';

// 所有食材数据
const allIngredientList = ref([
  {
    id: 1,
    name: "鸡肉",
    category: "肉类",
    calories: "165",
    protein: "31",
    fat: "3.6",
    carbs: "0",
    isSeasonal: false,
    image: "https://picsum.photos/seed/chicken/300/300.jpg",
  },
  {
    id: 2,
    name: "猪肉",
    category: "肉类",
    calories: "242",
    protein: "27",
    fat: "14",
    carbs: "0",
    isSeasonal: false,
    image: "https://picsum.photos/seed/pork/300/300.jpg",
  },
  {
    id: 3,
    name: "牛肉",
    category: "肉类",
    calories: "250",
    protein: "26",
    fat: "15",
    carbs: "0",
    isSeasonal: false,
    image: "https://picsum.photos/seed/beef/300/300.jpg",
  },
  {
    id: 4,
    name: "西兰花",
    category: "蔬菜",
    calories: "34",
    protein: "2.8",
    fat: "0.4",
    carbs: "7",
    isSeasonal: true,
    image: "https://picsum.photos/seed/broccoli/300/300.jpg",
  },
  {
    id: 5,
    name: "白菜",
    category: "蔬菜",
    calories: "17",
    protein: "1.5",
    fat: "0.2",
    carbs: "3.2",
    isSeasonal: true,
    image: "https://picsum.photos/seed/cabbage/300/300.jpg",
  },
  {
    id: 6,
    name: "菠菜",
    category: "蔬菜",
    calories: "23",
    protein: "2.9",
    fat: "0.4",
    carbs: "3.6",
    isSeasonal: true,
    image: "https://picsum.photos/seed/spinach/300/300.jpg",
  },
  {
    id: 7,
    name: "苹果",
    category: "水果",
    calories: "52",
    protein: "0.3",
    fat: "0.2",
    carbs: "14",
    isSeasonal: true,
    image: "https://picsum.photos/seed/apple/300/300.jpg",
  },
  {
    id: 8,
    name: "香蕉",
    category: "水果",
    calories: "89",
    protein: "1.1",
    fat: "0.3",
    carbs: "23",
    isSeasonal: false,
    image: "https://picsum.photos/seed/banana/300/300.jpg",
  },
  {
    id: 9,
    name: "虾",
    category: "海鲜",
    calories: "85",
    protein: "20",
    fat: "0.5",
    carbs: "0",
    isSeasonal: false,
    image: "https://picsum.photos/seed/shrimp/300/300.jpg",
  },
  {
    id: 10,
    name: "豆腐",
    category: "豆制品",
    calories: "76",
    protein: "8",
    fat: "4.8",
    carbs: "1.9",
    isSeasonal: false,
    image: "https://picsum.photos/seed/tofu/300/300.jpg",
  },
]);

// 过滤后的食材列表
const ingredientList = ref(allIngredientList.value);

// 搜索和过滤
const searchText = ref('');
const selectedCategory = ref('all');

// 过滤食材的方法
const filterIngredients = () => {
  ingredientList.value = allIngredientList.value.filter(ingredient => {
    // 分类过滤
    const categoryMatch = selectedCategory.value === "all" || ingredient.category === selectedCategory.value;
    
    // 搜索文本过滤
    const searchMatch = !searchText.value || 
      ingredient.name.toLowerCase().includes(searchText.value.toLowerCase());
    
    return categoryMatch && searchMatch;
  });
};

// 添加食材对话框相关
const addIngredientDialogVisible = ref(false);
const ingredientFormRef = ref(null);

// 食材表单数据
const ingredientForm = reactive({
  name: '',
  category: '',
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
  seasonalMonths: [], // 改为数组，存储开始和结束月份
  image: ''
});

// 表单验证规则
const ingredientFormRules = {
  name: [
    { required: true, message: '请输入食材名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择食材分类', trigger: 'change' }
  ],
  calories: [
    { required: true, message: '请输入热量值', trigger: 'blur' },
    { type: 'number', min: 0, max: 1000, message: '热量值应在 0-1000 之间', trigger: 'blur' }
  ],
  protein: [
    { required: true, message: '请输入蛋白质含量', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '蛋白质含量应在 0-100 之间', trigger: 'blur' }
  ],
  fat: [
    { required: true, message: '请输入脂肪含量', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '脂肪含量应在 0-100 之间', trigger: 'blur' }
  ],
  carbs: [
    { required: true, message: '请输入碳水化合物含量', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '碳水化合物含量应在 0-100 之间', trigger: 'blur' }
  ],
  seasonalMonths: [
    { required: true, message: '请选择时令月份', trigger: 'change' },
    { type: 'array', min: 2, max: 2, message: '请选择月份范围', trigger: 'change' }
  ],
  image: [
    { required: true, message: '请上传食材图片', trigger: 'change' }
  ]
};

// 月份标记
const monthMarks = reactive({
  1: '1月',
  3: '3月',
  6: '6月',
  9: '9月',
  12: '12月'
});

// 显示添加食材对话框
const showAddIngredientDialog = () => {
  addIngredientDialogVisible.value = true;
  // 重置表单
  Object.assign(ingredientForm, {
    name: '',
    category: '',
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    seasonalMonths: [3, 9], // 默认选择3月到9月
    image: ''
  });
  if (ingredientFormRef.value) {
    ingredientFormRef.value.clearValidate();
  }
};

// 关闭对话框
const handleCloseDialog = () => {
  addIngredientDialogVisible.value = false;
  // 重置表单
  Object.assign(ingredientForm, {
    name: '',
    category: '',
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    seasonalMonths: [],
    image: ''
  });
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
  ingredientForm.image = mockImageUrl;
  ElMessage.success('图片上传成功');
};

const handleImageChange = (file) => {
  // 这里应该上传图片到服务器并获取URL
  // 现在只是使用本地URL作为示例
  const reader = new FileReader();
  reader.onload = (e) => {
    ingredientForm.image = e.target.result;
  };
  reader.readAsDataURL(file.raw);
};

// 提交食材表单
const submitIngredientForm = () => {
  if (!ingredientFormRef.value) return;
  
  ingredientFormRef.value.validate((valid) => {
    if (valid) {
      // 创建新食材对象
      const newIngredient = {
        id: Date.now(), // 使用时间戳作为临时ID
        name: ingredientForm.name,
        category: ingredientForm.category,
        calories: ingredientForm.calories.toString(),
        protein: ingredientForm.protein.toString(),
        fat: ingredientForm.fat.toString(),
        carbs: ingredientForm.carbs.toString(),
        seasonalMonths: [...ingredientForm.seasonalMonths], // 复制月份数组
        isSeasonal: ingredientForm.seasonalMonths.length === 2, // 根据是否选择了月份判断是否当季
        image: ingredientForm.image
      };
      
      // 添加到食材列表
      allIngredientList.value.unshift(newIngredient);
      ingredientList.value = [...allIngredientList.value]; // 更新显示列表
      
      ElMessage.success('食材添加成功!');
      handleCloseDialog();
    } else {
      ElMessage.error('请正确填写表单信息!');
      return false;
    }
  });
};
</script>

<style lang="scss" scoped>
.food-library {
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

  .ingredient-grid {
    width: 100%;
    background: rgba(0, 0, 0, 0);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    overflow: visible;
    
    // 响应式布局
    @media (max-width: 1400px) {
      grid-template-columns: repeat(3, 1fr);
    }
    
    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }

      .ingredient-card {
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0);
        border: 1px solid #e5e7eb;
        transition: transform 0.2s ease;
        min-height: 280px;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .ingredient-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          background: rgba(0, 0, 0, 0);

          .ingredient-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            background-size: cover;
          }

          .ingredient-overlay {
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

            .ingredient-name {
              color: #ffffff;
              font-family: "Roboto";
              font-size: 14px;
              line-height: 20px;
              font-weight: 500;
            }
          }
        }

        .ingredient-info {
          padding: 12px;
          background: rgba(0, 0, 0, 0);

          .ingredient-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            .ingredient-category {
              color: #6b7280;
              font-family: "Roboto";
              font-size: 12px;
              line-height: 16px;
              font-weight: 400;
            }

            .ingredient-tags {
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

          .ingredient-nutrients {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 8px;

            .nutrient-item {
              font-size: 11px;
              color: #6b7280;
              background: #f3f4f6;
              padding: 2px 6px;
              border-radius: 4px;
            }
          }
        }
      }
  }
}

// 添加食材对话框样式
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
  }
}

// 表单样式
:deep(.ingredient-form) {
  .el-form-item {
    margin-bottom: 20px;
    
    .el-form-item__label {
      font-weight: 500;
      color: #374151;
    }
  }
  
  .el-input {
    width: 100%;
  }
  
  .el-select {
    width: 100%;
  }
  
  .el-input-number {
    width: 100%;
    
    .el-input__inner {
      text-align: left;
    }
  }
}

.image-upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.ingredient-uploader {
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
  
  .ingredient-image-preview {
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