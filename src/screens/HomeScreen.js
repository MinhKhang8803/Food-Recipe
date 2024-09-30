import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Categories from "../components/Categories";
import axios from "axios";
import Recipes from "../components/Recipes";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Beef");
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [language, setLanguage] = useState("en");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getCategories();
    getRecipes();
  }, [i18n.language]);

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
        const translatedCategories = response.data.categories.map((cat) => ({
          ...cat,
          strCategory: t(`categories.${cat.strCategory}`) || cat.strCategory,
        }));
        setCategories(translatedCategories);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getRecipes = async (category = "Beef") => {
    let englishCategory = category;

    // Translate back to the English version for the API
    for (const [key, value] of Object.entries(t("categories", { returnObjects: true }))) {
      if (value === category) {
        englishCategory = key;
        break;
      }
    }

    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${englishCategory}`
      );
      if (response && response.data) {
        setMeals(response.data.meals);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Handle language change
  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
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
          {/* Navbar with Avatar, Bell Icon and Language Picker */}
          <View className="mx-4 flex-row justify-between items-center">
            <AdjustmentsHorizontalIcon size={hp(4)} color={"gray"} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/images/avatar.png")}
                style={{
                  width: hp(5),
                  height: hp(5),
                  resizeMode: "cover",
                }}
                className="rounded-full"
              />

              {/* Language Picker */}
              <View style={{ marginLeft: 10 }}>
                <Picker
                  selectedValue={language}
                  style={{ height: 50, width: 150 }}
                  onValueChange={(itemValue) => changeLanguage(itemValue)}
                >
                  <Picker.Item label="English (US)" value="en" />
                  <Picker.Item label="English (UK)" value="en-UK" />
                  <Picker.Item label="Tiếng Việt" value="vi" />
                  <Picker.Item label="日本語" value="ja" />
                  <Picker.Item label="中文" value="zh" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Headlines */}
          <View className="mx-4 space-y-1 mb-2">
            <Text
              style={{
                fontSize: hp(3.5),
              }}
              className="font-bold text-neutral-800"
            >
              {t("fast_and_delicious")}
            </Text>

            <Text
              style={{
                fontSize: hp(3.5),
              }}
              className="font-extrabold text-neutral-800"
            >
              <Text>Choose your </Text>
              <Text className="text-[#f64e32]">Recipes</Text>
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
            <TextInput
              placeholder={t("search_placeholder")}
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
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
