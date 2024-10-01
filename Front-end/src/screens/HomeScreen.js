import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Categories from "../components/Categories";
import Recipes from "../components/Recipes";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";

// Function to dynamically load the correct language JSON file for meals
const loadMealDataForLanguage = async (lang) => {
  try {
    switch (lang) {
      case 'vi':
        return (await import('../data/all_meals_data_VI.json')).default;
      case 'fr':
        return (await import('../data/all_meals_data_FR.json')).default;
      case 'ja':
        return (await import('../data/all_meals_data_JA.json')).default;
      case 'zh':
        return (await import('../data/all_meals_data_ZH.json')).default;
      default:
        return (await import('../data/all_meals_data.json')).default; // English as default
    }
  } catch (error) {
    console.error(`Failed to load meal data for language: ${lang}`, error);
    return []; // Return empty array on failure
  }
};

// Function to dynamically load the correct language JSON file for categories
const loadCategoryDataForLanguage = async (lang) => {
  try {
    switch (lang) {
      case 'vi':
        return (await import('../data/meals_data_category_VI.json')).default;
      case 'fr':
        return (await import('../data/meals_data_category_FR.json')).default;
      case 'ja':
        return (await import('../data/meals_data_category_JA.json')).default;
      case 'zh':
        return (await import('../data/meals_data_category_ZH.json')).default;
      default:
        return (await import('../data/meals_data_category.json')).default; // English as default
    }
  } catch (error) {
    console.error(`Failed to load category data for language: ${lang}`, error);
    return []; // Return empty array on failure
  }
};

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Beef");
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [language, setLanguage] = useState("en");
  const { t, i18n } = useTranslation();

  // Function to load categories dynamically based on the selected language
  const loadCategories = async () => {
    setIsLoading(true);
    const categoryData = await loadCategoryDataForLanguage(i18n.language); // Load categories
    const categoriesWithImages = categoryData.categories.map((category) => ({
      strCategory: category.strCategory,
      strCategoryThumb: category.strCategoryThumb,
      strCategoryTranslated: t(`${category.strCategory}`) || category.strCategory,  // Translate category if available
    }));
    setCategories(categoriesWithImages);
    setIsLoading(false);
  };

  // Function to load meals based on category and language
  const loadMeals = async (category = "Beef") => {
    setIsLoading(true); // Start loading spinner
    const mealData = await loadMealDataForLanguage(i18n.language); // Dynamically load the meal data
    
    const filteredMeals = mealData.filter(
      (meal) => meal.strCategory.toLowerCase() === category.toLowerCase()
    );

    setMeals(filteredMeals);
    setIsLoading(false); // Stop loading spinner
  };

  useEffect(() => {
    loadCategories();  // Load categories dynamically
    loadMeals();       // Load meals for the default category (Beef)
  }, [i18n.language]); // Re-load when language changes

  const handleChangeCategory = (category) => {
    setActiveCategory(category);  // Update selected category
    loadMeals(category);          // Load meals for the selected category
  };

  // Handle language change
  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  // Filter meals based on search query
  const filteredMeals = meals.filter((meal) =>
    meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase()) // Match search query (case-insensitive)
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <SafeAreaView>
        {isLoading ? ( // Show loading spinner if data is being loaded
          <ActivityIndicator size="large" color="#f64e32" />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 50,
            }}
            className="space-y-6 pt-14"
          >
            {/* Navbar with Avatar, Bell Icon, and Language Picker */}
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
                    <Picker.Item label="Tiếng Việt" value="vi" />
                    <Picker.Item label="日本語" value="ja" />
                    <Picker.Item label="中文" value="zh" />
                    <Picker.Item label="Français" value="fr" />
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
                <Text>{t("choose_your")}</Text>
                <Text className="text-[#f64e32]">{t("recipes")}</Text>
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
                value={searchQuery} // Bind the search query state
                onChangeText={(text) => setSearchQuery(text)} // Update search query
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

            {/* Meals */}
            <View>
              <Recipes meals={filteredMeals} categories={categories} />
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
