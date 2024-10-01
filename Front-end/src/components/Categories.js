import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";

export default function Categories({ categories, activeCategory, handleChangeCategory }) {
  const { t } = useTranslation();

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-4"
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
      >
        {categories.map((category, index) => {
          let isActive = category.strCategory == activeCategory;
          let activeButtonClass = isActive ? "bg-[#f64e32] " : "bg-black/10";

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleChangeCategory(category.strCategory)}
              className="flex items-center space-y-1"
            >
              <View className={"rounded-xl p-[6px] " + activeButtonClass}>
                <Image
                  source={{
                    uri: category.strCategoryThumb,
                  }}
                  style={{
                    width: hp(6),
                    height: hp(6),
                  }}
                  className="rounded-full"
                />
              </View>
              {/* Display Translated Category Name */}
              <Text
                className="text-neutral-800 "
                style={{
                  fontSize: hp(1.6),
                }}
              >
                {category.strCategoryTranslated} {/* Show translated name */}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
