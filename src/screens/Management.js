import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';

const Management = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const managementItems = [
    {
      id: 1,
      title: '사용자 관리',
      icon: '👥',
      description: '사용자 권한 및 계정 관리',
    },
    {
      id: 2,
      title: '물품 카테고리 관리',
      icon: '📦',
      description: '물품 분류 및 카테고리 설정',
    },
    {
      id: 3,
      title: '보관 위치 관리',
      icon: '📍',
      description: '보관 위치 등록 및 관리',
    },
    {
      id: 4,
      title: '권한 설정',
      icon: '🔐',
      description: '사용자별 권한 설정',
    },
    {
      id: 5,
      title: '데이터 백업',
      icon: '💾',
      description: '데이터 백업 및 복원',
    },
    {
      id: 6,
      title: '시스템 설정',
      icon: '⚙️',
      description: '시스템 기본 설정',
    },
  ];

  const handleItemPress = (item) => {
    Alert.alert('관리', `${item.title} 기능을 선택하셨습니다.`);
  };

  const handleBackup = () => {
    Alert.alert('백업', '데이터 백업이 시작되었습니다.');
  };

  const handleRestore = () => {
    Alert.alert('복원', '데이터 복원이 시작되었습니다.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>입반출 관리</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 설정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>시스템 설정</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>알림 설정</Text>
              <Text style={styles.settingDescription}>입반출 알림 받기</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>자동 백업</Text>
              <Text style={styles.settingDescription}>주기적 데이터 백업</Text>
            </View>
            <Switch
              value={autoBackupEnabled}
              onValueChange={setAutoBackupEnabled}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={autoBackupEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>다크 모드</Text>
              <Text style={styles.settingDescription}>어두운 테마 사용</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={darkModeEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* 관리 메뉴 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>관리 메뉴</Text>
          
          {managementItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.managementItem}
              onPress={() => handleItemPress(item)}
            >
              <Text style={styles.itemIcon}>{item.icon}</Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              <Text style={styles.itemArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 데이터 관리 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>데이터 관리</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleBackup}>
              <Text style={styles.actionButtonText}>데이터 백업</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.restoreButton]} 
              onPress={handleRestore}
            >
              <Text style={styles.restoreButtonText}>데이터 복원</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: '#28A745',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  managementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemArrow: {
    fontSize: 18,
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restoreButton: {
    backgroundColor: '#FF6B6B',
  },
  restoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Management; 