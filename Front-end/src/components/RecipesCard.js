import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

export default function RecipesCard({ index, navigation, item }) {
  const { t } = useTranslation();
  const isEven = index % 2 === 0;
  
  const translatedMealName = t(`meals.${item.strMeal}`, { defaultValue: item.strMeal });

  return (
    <View>
      <Pressable
        style={{
          width: "100%",
          paddingRight: isEven ? 8 : 0,
        }}
        className="flex justify-center mb-4 space-y-1"
        onPress={() => navigation.navigate("RecipeDetails", { ...item })}
      >
        <Image
          source={{
            uri: item.strMealThumb,
          }}
          style={{
            width: "100%",
            height: index % 3 === 0 ? hp(25) : hp(35),
            borderRadius: 35,
          }}
          className="bg-black/5 relative"
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: hp(20),
            borderBottomLeftRadius: 35,
            borderBottomRightRadius: 35,
          }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />

        <Text
          style={{
            fontSize: hp(2.2),
          }}
          className="font-semibold ml-2 text-white absolute bottom-7 left-2 max-w-[80%]"
        >
          {translatedMealName.length > 20
            ? translatedMealName.slice(0, 20) + "..."
            : translatedMealName}
        </Text>
      </Pressable>
    </View>
  );
}
