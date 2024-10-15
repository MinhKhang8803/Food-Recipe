import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

export default function UserScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Recipes Created</Text>
            <Text style={styles.infoValue}>15</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Followers</Text>
            <Text style={styles.infoValue}>120</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Following</Text>
            <Text style={styles.infoValue}>80</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>View Recipes</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>Liked "Spaghetti Bolognese"</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>Commented on "Pancakes"</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#f64e32',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: hp(3),
    fontWeight: '700',
    color: '#fff',
  },
  email: {
    fontSize: hp(2),
    color: '#f0f0f0',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: hp(2),
    color: '#888',
  },
  infoValue: {
    fontSize: hp(2.5),
    fontWeight: '600',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    backgroundColor: '#075eec',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: hp(2),
    color: '#fff',
    fontWeight: '600',
  },
  activitySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: hp(2.5),
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  activityItem: {
    marginBottom: 10,
  },
  activityText: {
    fontSize: hp(2),
    color: '#666',
  },
});
