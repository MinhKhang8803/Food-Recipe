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
    },
  },
  "en-UK": {
    translation: {
      fast_and_delicious: "Fast & Delicious (UK)",
      food_you_love: "Food You Love (UK)",
      search_placeholder: "Search Your Favourite Food",
    },
  },
  vi: {
    translation: {
      fast_and_delicious: "Nhanh & Ngon",
      food_you_love: "Món ăn bạn yêu thích",
      search_placeholder: "Tìm kiếm món ăn yêu thích",
    },
  },
  ja: {
    translation: {
      fast_and_delicious: "速くておいしい",
      food_you_love: "あなたの好きな食べ物",
      search_placeholder: "好きな食べ物を検索",
    },
  },
  zh: {
    translation: {
      fast_and_delicious: "快速美味",
      food_you_love: "你爱的食物",
      search_placeholder: "搜索你喜欢的食物",
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
