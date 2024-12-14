import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      fast_and_delicious: "Fast & Delicious",
      food_you_love: "Food You Love",
      search_placeholder: "Search Your Favorite Food",
      choose_your: "Choose your ",
      recipes: "Recipes !",
      love: "Love",
      categories: {
        Beef: "Beef",
        Chicken: "Chicken",
        Dessert: "Dessert",
        Lamb: "Lamb",
        Miscellaneous: "Miscellaneous",
        Pasta: "Pasta",
        Pork: "Pork",
        Seafood: "Seafood",
        Side: "Side",
        Starter: "Starter",
        Vegan: "Vegan",
        Vegetarian: "Vegetarian",
        Breakfast: "Breakfast",
        Goat: "Goat",
      },
    },
  },
  "en-UK": {
    translation: {
      fast_and_delicious: "Fast & Delicious (UK)",
      food_you_love: "Food You Love (UK)",
      search_placeholder: "Search Your Favourite Food",
      choose_your: "Choose your ",
      recipes: "Recipes !",
      categories: {
        Beef: "Beef",
        Chicken: "Chicken",
        Dessert: "Dessert",
        Lamb: "Lamb",
        Miscellaneous: "Miscellaneous",
        Pasta: "Pasta",
        Pork: "Pork",
        Seafood: "Seafood",
        Side: "Side",
        Starter: "Starter",
        Vegan: "Vegan",
        Vegetarian: "Vegetarian",
        Breakfast: "Breakfast",
        Goat: "Goat",
      },
    },
  },
  vi: {
    translation: {
      fast_and_delicious: "Nhanh & Ngon",
      food_you_love: "Món ăn bạn yêu thích",
      search_placeholder: "Tìm kiếm món ăn yêu thích",
      choose_your: "Hãy chọn ",
      recipes: "Công thức của bạn !",
      love: "Yêu",
      categories: {
        Beef: "Bò",
        Chicken: "Gà",
        Dessert: "Tráng miệng",
        Lamb: "Cừu",
        Miscellaneous: "Khác",
        Pasta: "Mì Ý",
        Pork: "Thịt lợn",
        Seafood: "Hải sản",
        Side: "Món phụ",
        Starter: "Khai vị",
        Vegan: "Thuần chay",
        Vegetarian: "Chay",
        Breakfast: "Bữa sáng",
        Goat: "Dê",
      },
    },
  },
  ja: {
    translation: {
      fast_and_delicious: "速くておいしい",
      food_you_love: "あなたの好きな食べ物",
      search_placeholder: "好きな食べ物を検索",
      categories: {
        Beef: "牛肉",
        Chicken: "鶏肉",
        Dessert: "デザート",
        Lamb: "子羊肉",
        Miscellaneous: "その他",
        Pasta: "パスタ",
        Pork: "豚肉",
        Seafood: "シーフード",
        Side: "サイドメニュー",
        Starter: "前菜",
        Vegan: "ビーガン",
        Vegetarian: "ベジタリアン",
        Breakfast: "朝ごはん",
        Goat: "ヤギ",
      },
    },
  },
  zh: {
    translation: {
      fast_and_delicious: "快速美味",
      food_you_love: "你爱的食物",
      search_placeholder: "搜索你喜欢的食物",
      categories: {
        Beef: "牛肉",
        Chicken: "鸡肉",
        Dessert: "甜点",
        Lamb: "羊肉",
        Miscellaneous: "杂项",
        Pasta: "意大利面",
        Pork: "猪肉",
        Seafood: "海鲜",
        Side: "配菜",
        Starter: "开胃菜",
        Vegan: "纯素",
        Vegetarian: "素食",
        Breakfast: "早餐",
        Goat: "山羊",
      },
    },
  },
};

// Initialize i18n
i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,  
    },
  });

export default i18n;
