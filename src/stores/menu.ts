import { ref } from 'vue'
import { defineStore } from 'pinia'

// 菜品类型定义
export interface Dish {
  id: number
  name: string
  category: string
  calories: string
  isSeasonal: boolean
  image: string
  icon?: string // 添加图标字段
  allergens?: string[] // 过敏原
  dietType?: string[] // 饮食类型
}

// 周菜单数据类型
export interface WeekMenuData {
  [mealType: string]: {
    [day: string]: Dish[]
  }
}

// 规划设置类型
export interface PlanningSettings {
  nutritionBalance: boolean
  allergens: string[]
  dietPreference: string
  seasonalPriority: number
}

export const useMenuStore = defineStore('menu', () => {
  // 菜品库数据
  const dishLibrary = ref<Dish[]>([
    {
      id: 1,
      name: "番茄炒蛋",
      category: "荤菜",
      calories: "280",
      isSeasonal: true,
      image: "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/2cdec50a3c2cb774ba42088ace7d78bc.png",
      icon: "🍳",
      allergens: ["egg"],
      dietType: ["vegetarian"]
    },
    {
      id: 2,
      name: "清蒸鲈鱼",
      category: "荤菜",
      calories: "220",
      isSeasonal: true,
      image: "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/8f69a1a59a0da534c6b14191a6b3fc18.png",
      icon: "🐟",
      allergens: ["seafood"],
      dietType: []
    },
    {
      id: 3,
      name: "蒜蓉西兰花",
      category: "素菜",
      calories: "120",
      isSeasonal: true,
      image: "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/c00cbdf6638cc2bd9b19f4bcc5cc120a.png",
      icon: "🥦",
      allergens: [],
      dietType: ["vegetarian", "vegan"]
    },
    {
      id: 4,
      name: "紫菜蛋花汤",
      category: "汤类",
      calories: "80",
      isSeasonal: false,
      image: "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/2300f84b04badd4a156be9ce8be2d271.png",
      icon: "🍲",
      allergens: ["egg", "seafood"],
      dietType: ["vegetarian"]
    },
    {
      id: 5,
      name: "红烧排骨",
      category: "荤菜",
      calories: "350",
      isSeasonal: false,
      image: "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/519634b7d1484d08b9608a289eb7b9bc.png",
      icon: "🍖",
      allergens: [],
      dietType: []
    },
    {
      id: 6,
      name: "清炒菠菜",
      category: "素菜",
      calories: "90",
      isSeasonal: true,
      image: "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/ecf053e6cbb071d2f27a0ff08145ed01.png",
      icon: "🥬",
      allergens: [],
      dietType: ["vegetarian", "vegan"]
    },
    {
      id: 7,
      name: "南瓜粥",
      category: "主食",
      calories: "150",
      isSeasonal: true,
      image: "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/18e4bff672fb2b2f33f2afee0ff95d2b.png",
      icon: "🎃",
      allergens: [],
      dietType: ["vegetarian", "vegan"]
    },
    {
      id: 8,
      name: "水果沙拉",
      category: "甜点",
      calories: "180",
      isSeasonal: true,
      image: "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/8843f5f841753d805043638c9b4985a5.png",
      icon: "🥗",
      allergens: ["nuts"],
      dietType: ["vegetarian", "vegan"]
    },
    {
      id: 9,
      name: "宫保鸡丁",
      category: "荤菜",
      calories: "320",
      isSeasonal: false,
      image: "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/2cdec50a3c2cb774ba42088ace7d78bc.png",
      icon: "🍗",
      allergens: ["peanut"],
      dietType: []
    },
    {
      id: 10,
      name: "麻婆豆腐",
      category: "素菜",
      calories: "200",
      isSeasonal: false,
      image: "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/c00cbdf6638cc2bd9b19f4bcc5cc120a.png",
      icon: "🥘",
      allergens: [],
      dietType: ["vegetarian"]
    },
    {
      id: 11,
      name: "酸辣土豆丝",
      category: "素菜",
      calories: "130",
      isSeasonal: true,
      image: "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/ecf053e6cbb071d2f27a0ff08145ed01.png",
      icon: "🥔",
      allergens: [],
      dietType: ["vegetarian", "vegan"]
    },
    {
      id: 12,
      name: "糖醋里脊",
      category: "荤菜",
      calories: "380",
      isSeasonal: false,
      image: "https://ux.srdcloud.cn/file_proxy/app-mastergo-default/165346298763006/165346298763007/519634b7d1484d08b9608a289eb7b9bc.png",
      icon: "🥩",
      allergens: [],
      dietType: []
    }
  ])

  // 周菜单数据
  const weekMenu = ref<WeekMenuData>({
    "早餐": {
      "周一": [],
      "周二": [],
      "周三": [],
      "周四": [],
      "周五": [],
      "周六": [],
      "周日": []
    },
    "午餐": {
      "周一": [],
      "周二": [],
      "周三": [],
      "周四": [],
      "周五": [],
      "周六": [],
      "周日": []
    },
    "晚餐": {
      "周一": [],
      "周二": [],
      "周三": [],
      "周四": [],
      "周五": [],
      "周六": [],
      "周日": []
    }
  })

  // 过滤符合条件的菜品
  const filterDishes = (settings: PlanningSettings): Dish[] => {
    let filteredDishes = [...dishLibrary.value]

    // 过敏原过滤
    if (settings.allergens.length > 0) {
      filteredDishes = filteredDishes.filter(dish => {
        // 如果菜品没有过敏原信息，保留
        if (!dish.allergens || dish.allergens.length === 0) return true
        // 检查菜品是否包含用户过敏的成分
        return !dish.allergens.some(allergen => settings.allergens.includes(allergen))
      })
    }

    // 饮食偏好过滤
    if (settings.dietPreference && settings.dietPreference !== 'unlimited') {
      filteredDishes = filteredDishes.filter(dish => {
        if (!dish.dietType || dish.dietType.length === 0) return false
        return dish.dietType.includes(settings.dietPreference)
      })
    }

    // 季节性优先级（高优先级时优先选择当季菜品）
    if (settings.seasonalPriority === 3) {
      // 高优先级：当季菜品在前
      filteredDishes.sort((a, b) => {
        if (a.isSeasonal && !b.isSeasonal) return -1
        if (!a.isSeasonal && b.isSeasonal) return 1
        return 0
      })
    } else if (settings.seasonalPriority === 1) {
      // 低优先级：非当季菜品在前
      filteredDishes.sort((a, b) => {
        if (!a.isSeasonal && b.isSeasonal) return -1
        if (a.isSeasonal && !b.isSeasonal) return 1
        return 0
      })
    }

    return filteredDishes
  }

  // 生成周菜单
  const generateWeekMenu = (settings: PlanningSettings) => {
    const filteredDishes = filterDishes(settings)

    if (filteredDishes.length === 0) {
      console.warn('没有符合条件的菜品')
      return
    }

    const mealTypes = ["早餐", "午餐", "晚餐"]
    const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]

    // 为每个餐次和每天随机选择多道菜品
    mealTypes.forEach(mealType => {
      weekDays.forEach(day => {
        // 根据餐次类型选择合适的菜品
        let suitableDishes = [...filteredDishes]

        // 确定每餐的菜品数量
        let dishCount = 2 // 默认2道
        if (mealType === "早餐") {
          dishCount = 2 // 早餐2道（例如：主食+小菜）
          // 早餐优先选择主食、甜点、素菜
          const breakfastDishes = suitableDishes.filter(d =>
            d.category === "主食" || d.category === "甜点" || d.category === "素菜"
          )
          if (breakfastDishes.length > 0) {
            suitableDishes = breakfastDishes
          }
        } else if (mealType === "午餐" || mealType === "晚餐") {
          dishCount = 3 // 午餐和晚餐3道（例如：荤菜+素菜+汤）
          // 午餐和晚餐优先选择荤菜、素菜、汤类
          const mealDishes = suitableDishes.filter(d =>
            d.category === "荤菜" || d.category === "素菜" || d.category === "汤类"
          )
          if (mealDishes.length > 0) {
            suitableDishes = mealDishes
          }
        }

        // 选择多道菜品，避免重复
        const selectedDishes: Dish[] = []
        const usedIds = new Set<number>()

        for (let i = 0; i < dishCount; i++) {
          // 过滤掉已选择的菜品
          const availableDishes = suitableDishes.filter(d => !usedIds.has(d.id))

          if (availableDishes.length === 0) break // 没有更多可选菜品

          // 如果需要营养均衡，根据热量和类别选择
          if (settings.nutritionBalance && availableDishes.length > 1) {
            // 确保菜品类型多样性
            if (i === 0 && (mealType === "午餐" || mealType === "晚餐")) {
              // 第一道优先选荤菜
              const meatDishes = availableDishes.filter(d => d.category === "荤菜")
              if (meatDishes.length > 0) {
                const randomIndex = Math.floor(Math.random() * meatDishes.length)
                selectedDishes.push(meatDishes[randomIndex])
                usedIds.add(meatDishes[randomIndex].id)
                continue
              }
            } else if (i === 1 && (mealType === "午餐" || mealType === "晚餐")) {
              // 第二道优先选素菜
              const vegDishes = availableDishes.filter(d => d.category === "素菜")
              if (vegDishes.length > 0) {
                const randomIndex = Math.floor(Math.random() * vegDishes.length)
                selectedDishes.push(vegDishes[randomIndex])
                usedIds.add(vegDishes[randomIndex].id)
                continue
              }
            } else if (i === 2 && (mealType === "午餐" || mealType === "晚餐")) {
              // 第三道优先选汤类
              const soupDishes = availableDishes.filter(d => d.category === "汤类")
              if (soupDishes.length > 0) {
                const randomIndex = Math.floor(Math.random() * soupDishes.length)
                selectedDishes.push(soupDishes[randomIndex])
                usedIds.add(soupDishes[randomIndex].id)
                continue
              }
            }
          }

          // 随机选择一个菜品（从前5个中选，保持一定随机性）
          const topDishes = availableDishes.slice(0, Math.min(5, availableDishes.length))
          const randomIndex = Math.floor(Math.random() * topDishes.length)
          selectedDishes.push(topDishes[randomIndex])
          usedIds.add(topDishes[randomIndex].id)
        }

        weekMenu.value[mealType][day] = selectedDishes
      })
    })
  }

  // 设置单个菜品（添加到数组）
  const setDish = (mealType: string, day: string, dish: Dish) => {
    if (weekMenu.value[mealType] && weekMenu.value[mealType][day] !== undefined) {
      weekMenu.value[mealType][day].push(dish)
    }
  }

  // 清空周菜单
  const clearWeekMenu = () => {
    const mealTypes = ["早餐", "午餐", "晚餐"]
    const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]

    mealTypes.forEach(mealType => {
      weekDays.forEach(day => {
        weekMenu.value[mealType][day] = []
      })
    })
  }

  // 添加菜品到菜品库
  const addDish = (dish: Dish) => {
    dishLibrary.value.unshift(dish)
  }

  return {
    dishLibrary,
    weekMenu,
    generateWeekMenu,
    setDish,
    clearWeekMenu,
    addDish,
    filterDishes
  }
})
