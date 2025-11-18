<template>
  <div class="weekly-menu-container">
    <div class="app-wrapper">
      <navbar class="app-header" />
      
      <div class="main-content">
        <div class="page-header">
          <h2 class="page-title">每周菜单</h2>
          <div class="header-actions">
            <el-button type="primary" @click="generateWeeklyMenu">生成菜单</el-button>
            <el-button type="success" @click="saveMenu">保存菜单</el-button>
          </div>
        </div>

        <div class="menu-settings">
          <div class="setting-item">
            <span>选择周：</span>
            <el-date-picker
              v-model="selectedWeek"
              type="week"
              format="YYYY 第 WW 周"
              placeholder="选择周"
              @change="handleWeekChange"
            />
          </div>
          <div class="setting-item">
            <span>菜单类型：</span>
            <el-select v-model="menuType" placeholder="选择菜单类型">
              <el-option label="工作日菜单" value="weekday" />
              <el-option label="周末菜单" value="weekend" />
              <el-option label="全周菜单" value="all" />
            </el-select>
          </div>
        </div>

        <div class="weekly-menu-content" v-if="weeklyMenu.length > 0">
          <div class="week-overview">
            <div class="nutrition-summary">
              <h3>营养概览</h3>
              <div class="summary-cards">
                <div class="summary-card">
                  <span class="card-label">日均热量</span>
                  <span class="card-value">{{ averageCalories }} 卡</span>
                </div>
                <div class="summary-card">
                  <span class="card-label">荤素比例</span>
                  <span class="card-value">{{ meatVeggieRatio }}</span>
                </div>
                <div class="summary-card">
                  <span class="card-label">种类多样性</span>
                  <span class="card-value">{{ varietyScore }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="menu-calendar">
            <div v-for="(day, index) in weeklyMenu" :key="index" class="day-menu">
              <div class="day-header">
                <h3>{{ day.date }} ({{ day.dayOfWeek }})</h3>
                <div class="day-actions">
                  <el-button size="small" @click="editDayMenu(index)">编辑</el-button>
                </div>
              </div>
              <div class="meals-container">
                <div v-for="(meal, mealIndex) in day.meals" :key="mealIndex" class="meal-section">
                  <div class="meal-header">
                    <span class="meal-name">{{ meal.name }}</span>
                    <span class="meal-calories">{{ meal.totalCalories }} 卡</span>
                  </div>
                  <div class="dishes-list">
                    <div v-for="(dish, dishIndex) in meal.dishes" :key="dishIndex" class="dish-item" @click="showDishDetail(dish)">
                      <span class="dish-name">{{ dish.name }}</span>
                      <span class="dish-category">{{ dish.category }}</span>
                      <span class="dish-calories">{{ dish.calories }} 卡</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" v-else>
          <div class="empty-icon">📋</div>
          <h3>暂无菜单数据</h3>
          <p>点击上方"生成菜单"按钮，系统将为您生成营养均衡的每周菜单</p>
        </div>

        <!-- 菜品详情对话框 -->
        <el-dialog
          v-model="dishDetailVisible"
          title="菜品详情"
          width="600px"
        >
          <div class="dish-detail-container">
            <div class="dish-image-container">
              <img :src="selectedDish.image" :alt="selectedDish.name" class="dish-detail-image" />
            </div>
            <div class="dish-info-container">
              <h3 class="dish-detail-name">{{ selectedDish.name }}</h3>
              <div class="dish-detail-meta">
                <div class="meta-item">
                  <span class="meta-label">分类：</span>
                  <span class="meta-value">{{ selectedDish.category }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">热量：</span>
                  <span class="meta-value">{{ selectedDish.calories }} 卡</span>
                </div>
                <div class="meta-item" v-if="selectedDish.seasonalMonths">
                  <span class="meta-label">时令月份：</span>
                  <span class="meta-value">{{ formatSeasonalMonths(selectedDish.seasonalMonths) }}</span>
                </div>
              </div>
              <div class="dish-nutrition">
                <h4>营养成分</h4>
                <div class="nutrition-grid">
                  <div class="nutrition-item" v-if="selectedDish.protein">
                    <span class="nutrition-label">蛋白质</span>
                    <span class="nutrition-value">{{ selectedDish.protein }}g</span>
                  </div>
                  <div class="nutrition-item" v-if="selectedDish.fat">
                    <span class="nutrition-label">脂肪</span>
                    <span class="nutrition-value">{{ selectedDish.fat }}g</span>
                  </div>
                  <div class="nutrition-item" v-if="selectedDish.carbs">
                    <span class="nutrition-label">碳水化合物</span>
                    <span class="nutrition-value">{{ selectedDish.carbs }}g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-dialog>

        <!-- 编辑每日菜单对话框 -->
        <el-dialog
          v-model="editDialogVisible"
          title="编辑每日菜单"
          width="700px"
        >
          <div class="edit-dialog-content">
            <div v-for="(meal, mealIndex) in editingDay.meals" :key="mealIndex" class="edit-meal">
              <h4>{{ meal.name }}</h4>
              <div class="dish-selector">
                <el-select
                  v-model="selectedDishes[mealIndex]"
                  multiple
                  placeholder="选择菜品"
                  style="width: 100%"
                >
                  <el-option
                    v-for="dish in availableDishes"
                    :key="dish.id"
                    :label="`${dish.name} (${dish.category}, ${dish.calories}卡)`"
                    :value="dish.id"
                  />
                </el-select>
              </div>
            </div>
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="editDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="saveDayEdit">保存</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import {
  ElButton,
  ElDatePicker,
  ElSelect,
  ElOption,
  ElDialog,
  ElMessage
} from 'element-plus';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
import Navbar from '../mainpage/components/navbar.vue';

dayjs.extend(weekday);
dayjs.extend(isoWeek);

dayjs.locale('zh-cn');

// 可用菜品数据
const availableDishes = [
  { id: 1, name: '红烧肉', category: '荤菜', calories: 320 },
  { id: 2, name: '清炒菠菜', category: '素菜', calories: 80 },
  { id: 3, name: '蒸鱼', category: '荤菜', calories: 150 },
  { id: 4, name: '番茄鸡蛋', category: '素菜', calories: 120 },
  { id: 5, name: '麻婆豆腐', category: '素菜', calories: 180 },
  { id: 6, name: '青椒肉丝', category: '荤菜', calories: 200 },
  { id: 7, name: '白切鸡', category: '荤菜', calories: 250 },
  { id: 8, name: '蒜蓉西兰花', category: '素菜', calories: 60 },
  { id: 9, name: '小笼包', category: '主食', calories: 280 },
  { id: 10, name: '紫菜蛋花汤', category: '汤类', calories: 50 }
];

// 菜单设置
const selectedWeek = ref(new Date());
const menuType = ref('all');

// 每周菜单数据
const weeklyMenu = ref([]);

// 编辑对话框
const editDialogVisible = ref(false);
const editingDayIndex = ref(0);
const editingDay = reactive({
  date: '',
  dayOfWeek: '',
  meals: []
});
const selectedDishes = ref([[], [], []]);

// 菜品详情对话框
const dishDetailVisible = ref(false);
const selectedDish = reactive({
  id: 0,
  name: '',
  category: '',
  calories: 0,
  image: '',
  protein: 0,
  fat: 0,
  carbs: 0,
  seasonalMonths: []
});

// 计算属性
const averageCalories = computed(() => {
  if (weeklyMenu.value.length === 0) return 0;
  
  let totalCalories = 0;
  weeklyMenu.value.forEach(day => {
    day.meals.forEach(meal => {
      totalCalories += meal.totalCalories;
    });
  });
  
  return Math.round(totalCalories / weeklyMenu.value.length);
});

const meatVeggieRatio = computed(() => {
  if (weeklyMenu.value.length === 0) return '0:0';
  
  let meatCount = 0;
  let veggieCount = 0;
  
  weeklyMenu.value.forEach(day => {
    day.meals.forEach(meal => {
      meal.dishes.forEach(dish => {
        if (dish.category === '荤菜') {
          meatCount++;
        } else if (dish.category === '素菜') {
          veggieCount++;
        }
      });
    });
  });
  
  const total = meatCount + veggieCount;
  if (total === 0) return '0:0';
  
  const meatRatio = Math.round((meatCount / total) * 10) / 10;
  const veggieRatio = Math.round((veggieCount / total) * 10) / 10;
  
  return `${meatRatio}:${veggieRatio}`;
});

const varietyScore = computed(() => {
  if (weeklyMenu.value.length === 0) return 0;
  
  const dishNames = new Set();
  
  weeklyMenu.value.forEach(day => {
    day.meals.forEach(meal => {
      meal.dishes.forEach(dish => {
        dishNames.add(dish.name);
      });
    });
  });
  
  // 理想情况下一周应该有至少21种不同的菜（7天*3餐）
  const idealVariety = 21;
  const actualVariety = dishNames.size;
  
  return Math.min(100, Math.round((actualVariety / idealVariety) * 100));
});

// 方法
const handleWeekChange = () => {
  // 当选择的周变化时，可以加载对应的菜单数据
  generateWeeklyMenu();
};

const generateWeeklyMenu = () => {
  const startOfWeek = dayjs(selectedWeek.value).startOf('week').add(1, 'day'); // 周一作为开始
  const endOfWeek = startOfWeek.add(6, 'day'); // 周日作为结束
  const daysToShow = menuType.value === 'weekday' ? 5 : 7;
  
  weeklyMenu.value = [];
  
  for (let i = 0; i < daysToShow; i++) {
    const currentDate = startOfWeek.add(i, 'day');
    const dayOfWeek = currentDate.format('dddd');
    
    // 每天生成三餐
    const meals = generateDayMeals();
    
    weeklyMenu.value.push({
      date: currentDate.format('YYYY-MM-DD'),
      dayOfWeek,
      meals
    });
  }
};

const generateDayMeals = () => {
  const mealTypes = [
    { name: '早餐', dishCount: 2 },
    { name: '午餐', dishCount: 3 },
    { name: '晚餐', dishCount: 3 }
  ];
  
  return mealTypes.map(mealType => {
    // 随机选择菜品
    const dishes = [];
    const shuffled = [...availableDishes].sort(() => 0.5 - Math.random());
    
    // 确保每餐至少有一个荤菜和一个素菜
    const meatDishes = shuffled.filter(dish => dish.category === '荤菜').slice(0, Math.ceil(mealType.dishCount / 2));
    const veggieDishes = shuffled.filter(dish => dish.category === '素菜').slice(0, Math.floor(mealType.dishCount / 2));
    
    dishes.push(...meatDishes, ...veggieDishes);
    
    // 如果还需要更多菜，添加其他类型的菜
    if (dishes.length < mealType.dishCount) {
      const otherDishes = shuffled.filter(dish => 
        !dishes.some(selectedDish => selectedDish.id === dish.id)
      ).slice(0, mealType.dishCount - dishes.length);
      
      dishes.push(...otherDishes);
    }
    
    // 计算总热量
    const totalCalories = dishes.reduce((sum, dish) => sum + dish.calories, 0);
    
    return {
      name: mealType.name,
      dishes: dishes.slice(0, mealType.dishCount),
      totalCalories
    };
  });
};

const editDayMenu = (dayIndex) => {
  editingDayIndex.value = dayIndex;
  const day = weeklyMenu.value[dayIndex];
  
  editingDay.date = day.date;
  editingDay.dayOfWeek = day.dayOfWeek;
  editingDay.meals = JSON.parse(JSON.stringify(day.meals));
  
  // 设置已选菜品
  selectedDishes.value = day.meals.map(meal => 
    meal.dishes.map(dish => dish.id)
  );
  
  editDialogVisible.value = true;
};

const saveDayEdit = () => {
  // 更新每日菜单
  const updatedDay = {
    date: editingDay.date,
    dayOfWeek: editingDay.dayOfWeek,
    meals: editingDay.meals.map((meal, mealIndex) => {
      const mealDishIds = selectedDishes.value[mealIndex] || [];
      const mealDishes = mealDishIds.map(dishId => 
        availableDishes.find(dish => dish.id === dishId)
      ).filter(Boolean);
      
      const totalCalories = mealDishes.reduce((sum, dish) => sum + dish.calories, 0);
      
      return {
        name: meal.name,
        dishes: mealDishes,
        totalCalories
      };
    })
  };
  
  weeklyMenu.value[editingDayIndex.value] = updatedDay;
  editDialogVisible.value = false;
  
  ElMessage.success('菜单已更新');
};

const saveMenu = () => {
  // 这里可以添加保存菜单的逻辑
  ElMessage.success('菜单已保存');
};

// 显示菜品详情
const showDishDetail = (dish) => {
  // 查找完整的菜品信息
  const fullDish = availableDishes.find(d => d.id === dish.id);
  if (fullDish) {
    Object.assign(selectedDish, {
      ...fullDish,
      // 为每个菜品添加模拟的图片和营养成分
      image: `https://picsum.photos/seed/${fullDish.name}/300/300.jpg`,
      protein: Math.floor(Math.random() * 30) + 5, // 5-35g 蛋白质
      fat: Math.floor(Math.random() * 25) + 3, // 3-28g 脂肪
      carbs: Math.floor(Math.random() * 40) + 5, // 5-45g 碳水化合物
      seasonalMonths: [3, 9] // 默认时令月份
    });
    dishDetailVisible.value = true;
  }
};

// 格式化时令月份显示
const formatSeasonalMonths = (months) => {
  if (!months || months.length !== 2) return '全年';
  const [start, end] = months;
  if (start === end) return `${start}月`;
  return `${start}月-${end}月`;
};
</script>

<style lang="scss" scoped>
.weekly-menu-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f9fafb;
  
  .app-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    
    .app-header {
      flex: 0 0 60px;
      box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
      background: linear-gradient(transparent, #ffffff);
      z-index: 10;
    }
    
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 16px 24px;
      background: #f9fafb;
      min-height: 0;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
  }
}

  .main-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: linear-gradient(transparent, #ffffff);
    border-radius: 8px;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
    padding: 24px;
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

    .page-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
    }
  }

  .menu-settings {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    padding: 16px;
    background: #f9fafb;
    border-radius: 8px;

    .setting-item {
      display: flex;
      align-items: center;
      gap: 12px;

      span {
        font-size: 14px;
        color: #6b7280;
        min-width: 70px;
      }
    }
  }

  .weekly-menu-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;

    .week-overview {
      .nutrition-summary {
        background: #f9fafb;
        border-radius: 8px;
        padding: 20px;

        h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #374151;
        }

        .summary-cards {
          display: flex;
          gap: 16px;

          .summary-card {
            flex: 1;
            background: white;
            border-radius: 6px;
            padding: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            text-align: center;

            .card-label {
              display: block;
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 8px;
            }

            .card-value {
              font-size: 18px;
              font-weight: 600;
              color: #1f2937;
            }
          }
        }
      }
    }

    .menu-calendar {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .day-menu {
        background: #f9fafb;
        border-radius: 8px;
        padding: 16px;

        .day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #374151;
          }
        }

        .meals-container {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .meal-section {
            background: white;
            border-radius: 6px;
            padding: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

            .meal-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;

              .meal-name {
                font-weight: 600;
                color: #374151;
              }

              .meal-calories {
                color: #6b7280;
                font-size: 14px;
              }
            }

            .dishes-list {
              display: flex;
              flex-direction: column;
              gap: 6px;

              .dish-item {
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
                border-bottom: 1px solid #f0f0f0;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 0.2s;

                &:last-child {
                  border-bottom: none;
                }

                &:hover {
                  background-color: #f5f7fa;
                  border-radius: 4px;
                }

                .dish-name {
                  flex: 2;
                  color: #374151;
                }

                .dish-category {
                  flex: 1;
                  color: #6b7280;
                  text-align: center;
                }

                .dish-calories {
                  flex: 1;
                  color: #6b7280;
                  text-align: right;
                }
              }
            }
          }
        }
      }
    }
  }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #6b7280;

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      color: #374151;
    }

    p {
      margin: 0;
      max-width: 400px;
      line-height: 1.5;
    }
  }

  .edit-dialog-content {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .edit-meal {
      h4 {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: #374151;
      }
    }
  }

  .dialog-footer {
    text-align: right;
  }
}

// 菜品详情对话框样式
:deep(.el-dialog) {
  .dish-detail-container {
    display: flex;
    gap: 20px;
    
    .dish-image-container {
      flex: 0 0 200px;
      
      .dish-detail-image {
        width: 200px;
        height: 200px;
        border-radius: 8px;
        object-fit: cover;
      }
    }
    
    .dish-info-container {
      flex: 1;
      
      .dish-detail-name {
        margin: 0 0 16px 0;
        font-size: 20px;
        font-weight: 600;
        color: #1f2937;
      }
      
      .dish-detail-meta {
        margin-bottom: 20px;
        
        .meta-item {
          display: flex;
          margin-bottom: 10px;
          
          .meta-label {
            width: 100px;
            font-weight: 500;
            color: #6b7280;
          }
          
          .meta-value {
            color: #374151;
          }
        }
      }
      
      .dish-nutrition {
        h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #374151;
        }
        
        .nutrition-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          
          .nutrition-item {
            text-align: center;
            padding: 10px;
            background-color: #f9fafb;
            border-radius: 6px;
            
            .nutrition-label {
              display: block;
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 4px;
            }
            
            .nutrition-value {
              font-size: 14px;
              font-weight: 600;
              color: #374151;
            }
          }
        }
      }
    }
  }
}
</style>