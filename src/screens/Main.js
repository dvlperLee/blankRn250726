import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const MainScreen = ({ navigation }) => {
  const menuItems = [
    { id: 1, title: '반입', icon: '📥' },
    { id: 2, title: '반출', icon: '📤' },
    { id: 3, title: '입반출관리', icon: '⚙️' },
    { id: 4, title: '입반출내역', icon: '📋' },
    { id: 5, title: '로그아웃', icon: '🚪' },
  ];

  const handleMenuPress = (item) => {
    if (item.title === '로그아웃') {
      Alert.alert(
        '로그아웃',
        '정말 로그아웃하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { text: '로그아웃', onPress: () => navigation.navigate('Login') },
        ]
      );
    } else if (item.title === '반입') {
      navigation.navigate('Import');
    } else if (item.title === '반출') {
      navigation.navigate('Export');
    } else if (item.title === '입반출관리') {
      navigation.navigate('Management');
    } else if (item.title === '입반출내역') {
      navigation.navigate('History');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>입반출 관리 시스템</Text>
        <Text style={styles.welcomeText}>환영합니다!</Text>
      </View>

      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  menuContainer: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
});

export default MainScreen;