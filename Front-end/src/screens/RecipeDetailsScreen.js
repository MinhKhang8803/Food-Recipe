import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import Loading from "../components/Loading";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { setShouldAnimateExitingForTag } from "react-native-reanimated/lib/typescript/reanimated2/core";

// Function to dynamically load the correct language JSON file for recipe details
const loadRecipeDetailsForLanguage = async (lang, mealId) => {
  try {
    let mealData;

    switch (lang) {
      case "vi":
        mealData = (await import("../data/all_meals_data_VI.json")).default;
        break;
      case "fr":
        mealData = (await import("../data/all_meals_data_FR.json")).default;
        break;
      case "ja":
        mealData = (await import("../data/all_meals_data_JA.json")).default;
        break;
      case "zh":
        mealData = (await import("../data/all_meals_data_ZH.json")).default;
        break;
      default:
        mealData = (await import("../data/all_meals_data.json")).default; // English as default
        break;
    }

    // Find the selected meal by ID
    return mealData.find((meal) => meal.idMeal === mealId);
  } catch (error) {
    console.error(`Failed to load recipe details for language: ${lang}`, error);
    return null;
  }
};

export default function RecipeDetailsScreen(props) {
  let item = props.route.params;
  const navigation = useNavigation();
  const { i18n } = useTranslation();
  const [meal, setMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    fetchMealData(item.idMeal);
  }, [i18n.language]);

  const fetchMealData = async (id) => {
    setIsLoading(true);
    const mealData = await loadRecipeDetailsForLanguage(i18n.language, id);
    if (mealData) {
      setMeal(mealData);
    } else {
      console.error("Meal data not found");
    }
    setIsLoading(false);
  };

  // Get the image for the ingredient dynamically
  const getIngredientImage = (ingredient) => {
    if (!ingredient) return "https://www.themealdb.com/images/ingredients/default.png";

    // Sanitize and replace spaces with underscores
    const sanitizedIngredient = ingredient.trim().replace(/\s+/g, "%20");

    // Return the URL for the ingredient image
    return `https://www.themealdb.com/images/ingredients/${sanitizedIngredient}.png`;
  };

  // const getIngredientImage = (ingredient) => {
  //   if (!ingredient) return "https://www.themealdb.com/images/ingredients/default.png";
  
  //   // URL encode the entire ingredient name to handle spaces and special characters
  //   const sanitizedIngredient = encodeURIComponent(ingredient.trim());
  
  //   // Return the URL for the ingredient image
  //   return `https://www.themealdb.com/images/ingredients/${sanitizedIngredient}.png`;
  // };
  

  const ingredientsIndexes = (meal) => {
    if (!meal) return [];
    let indexes = [];

    for (let i = 1; i <= 20; i++) {
      if (meal["strIngredient" + i]) {
        indexes.push(i);
      }
    }

    return indexes;
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 30,
      }}
    >
      <View className="flex-row justify-center">
        <Image
          source={{ uri: item.strMealThumb }}
          style={{
            width: wp(100),
            height: hp(45),
          }}
        />
      </View>

      <View className="w-full absolute flex-row justify-between items-center pt-10">
        <View className="p-2 rounded-full bg-white ml-5">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon
              size={hp(3.5)}
              color={"#f64e32"}
              strokeWidth={4.5}
            />
          </TouchableOpacity>
        </View>

        <View className="p-2 rounded-full bg-white mr-5">
          <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)}>
            <HeartIcon
              size={hp(3.5)}
              color={isFavourite ? "#f64e32" : "gray"}
              strokeWidth={4.5}
            />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <Loading size="large" className="mt-16" />
      ) : (
        <View
          className="px-4 flex justify-between space-y-4 bg-white mt-[-46]"
          style={{
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            paddingTop: hp(3),
          }}
        >
          <Animated.View
            className="space-y-2 px-4"
            entering={FadeInDown.delay(200).duration(700).springify().damping(12)}
          >
            <Text
              className="font-bold flex-1 text-neutral-700"
              style={{ fontSize: hp(3) }}
            >
              {meal?.strMeal}
            </Text>

            <Text
              style={{ fontSize: hp(2) }}
              className="text-neutral-500 font-medium"
            >
              {meal?.strArea}
            </Text>
          </Animated.View>

          {/* Display Ingredients */}
          <Animated.View
            className="space-y-4 p-4"
            entering={FadeInDown.delay(300).duration(700).springify().damping(12)}
          >
            <Text style={{ fontSize: hp(2.5) }} className="font-bold flex-1 text-neutral-700">
              Ingredients
            </Text>

            <View className="space-y-2 ml-3">
              {ingredientsIndexes(meal).map((i) => (
                <View className="flex-row space-x-4 items-center" key={i}>
                  {/* Ingredient image */}
                  <Image
                    source={{ uri: getIngredientImage(meal["strIngredient" + i]) }}
                    style={{ width: hp(5), height: hp(5), resizeMode: "cover" }}
                    className="rounded-full"
                  />
                  <View className="flex-row space-x-2">
                    <Text style={{ fontSize: hp(1.7) }} className="font-medium text-neutral-800">
                      {meal["strIngredient" + i]}
                    </Text>
                    <Text className="font-extrabold text-neutral-700" style={{ fontSize: hp(1.7) }}>
                      {meal["strMeasure" + i]}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Display Instructions */}
          <Animated.View
            className="space-y-4 p-4"
            entering={FadeInDown.delay(400).duration(700).springify().damping(12)}
          >
            <Text className="font-bold flex-1 text-neutral-700" style={{ fontSize: hp(2.5) }}>
              Instructions
            </Text>

            <Text className="text-neutral-700" style={{ fontSize: hp(1.7) }}>
              {meal?.strInstructions}
            </Text>
          </Animated.View>
        </View>
      )}
    </ScrollView>
  );
}
