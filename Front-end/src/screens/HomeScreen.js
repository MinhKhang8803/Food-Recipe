import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  Button,
} from 'react-native';
import React, { useEffect, useState } from "react"; // Correct import, do not duplicate it
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Categories from "../components/Categories";
import axios from "axios";
import Recipes from "../components/Recipes";
import { useTranslation } from "react-i18next";  // Import translation hook

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Beef");
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const { t, i18n } = useTranslation();  // Initialize i18next translation functions

  useEffect(() => {
    getCategories();
    getRecipes();
  }, [i18n.language]);  // Rerun when language changes

  const handleChangeCategory = (category) => {
    getRecipes(category);
    setActiveCategory(category);
    setMeals([]);
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getRecipes = async (category = "Beef") => {
    let categoryToUse = category;

    if (i18n.language === "vi") {
      categoryToUse = "Bò";  // Example: Vietnamese equivalent
    } else if (i18n.language === "ja") {
      categoryToUse = "牛肉";  // Example: Japanese equivalent
    } else if (i18n.language === "zh") {
      categoryToUse = "牛肉";  // Example: Chinese equivalent
    }

    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryToUse}`
      );
      if (response && response.data) {
        setMeals(response.data.meals);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 50,
          }}
          className="space-y-6 pt-14"
        >
          {/* Avatar and Bell Icon */}
          <View className="mx-4 flex-row justify-between items-center">
            <AdjustmentsHorizontalIcon size={hp(4)} color={"gray"} />
            <Image
              source={require("../../assets/images/avatar.png")}
              style={{
                width: hp(5),
                height: hp(5),
                resizeMode: "cover",
              }}
              className="rounded-full"
            />
          </View>

          {/* Headlines */}
          <View className="mx-4 space-y-1 mb-2">
            <Text
              style={{
                fontSize: hp(3.5),
              }}
              className="font-bold text-neutral-800"
            >
              {t('fast_and_delicious')}  {/* Wrap translations in Text */}
            </Text>

            <Text
              style={{
                fontSize: hp(3.5),
              }}
              className="font-extrabold text-neutral-800"
            >
              {t('food_you_love')} <Text className="text-[#f64e32]">{t('love')}</Text> {/* Make sure nested texts are also wrapped in <Text> */}
            </Text>
          </View>

          {/* Search Bar */}
          <View className="mx-4 flex-row items-center border rounded-xl border-black p-[6px]">
            <View className="bg-white rounded-full p-2">
              <MagnifyingGlassIcon
                size={hp(2.5)}
                color={"gray"}
                strokeWidth={3}
              />
            </View>
            {/* Translated placeholder */}
            <TextInput
              placeholder={t('search_placeholder')}  
              placeholderTextColor={"gray"}
              style={{
                fontSize: hp(1.7),
              }}
              className="flex-1 text-base mb-1 pl-1 tracking-widest"
            />
          </View>

          {/* Categories */}
          <View>
            {categories.length > 0 && (
              <Categories
                categories={categories}
                activeCategory={activeCategory}
                handleChangeCategory={handleChangeCategory}
              />
            )}
          </View>

          {/* Recipes Meal */}
          <View>
            <Recipes meals={meals} categories={categories} />
          </View>

          {/* Language Switcher */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
            <Button title={t("english_us")} onPress={() => i18n.changeLanguage('en')} />
            <Button title={t("english_uk")} onPress={() => i18n.changeLanguage('en-UK')} />
            <Button title={t("vietnamese")} onPress={() => i18n.changeLanguage('vi')} />
            <Button title={t("japanese")} onPress={() => i18n.changeLanguage('ja')} />
            <Button title={t("chinese")} onPress={() => i18n.changeLanguage('zh')} />
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
