import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';

const History = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // 샘플 데이터
  const historyData = [
    {
      id: 1,
      type: '반입',
      itemName: '노트북',
      quantity: '1',
      date: '2024-01-15',
      time: '14:30',
      location: 'A-101',
      status: '완료',
    },
    {
      id: 2,
      type: '반출',
      itemName: '프린터',
      quantity: '2',
      date: '2024-01-14',
      time: '16:45',
      location: 'B-203',
      status: '완료',
    },
    {
      id: 3,
      type: '반입',
      itemName: '모니터',
      quantity: '5',
      date: '2024-01-13',
      time: '09:15',
      location: 'C-305',
      status: '진행중',
    },
    {
      id: 4,
      type: '반출',
      itemName: '키보드',
      quantity: '10',
      date: '2024-01-12',
      time: '11:20',
      location: 'A-102',
      status: '완료',
    },
    {
      id: 5,
      type: '반입',
      itemName: '마우스',
      quantity: '15',
      date: '2024-01-11',
      time: '13:40',
      location: 'B-201',
      status: '완료',
    },
  ];

  const filters = [
    { key: 'all', title: '전체' },
    { key: 'import', title: '반입' },
    { key: 'export', title: '반출' },
  ];

  const filteredData = selectedFilter === 'all' 
    ? historyData 
    : historyData.filter(item => 
        selectedFilter === 'import' ? item.type === '반입' : item.type === '반출'
      );

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <View style={[
          styles.typeBadge, 
          { backgroundColor: item.type === '반입' ? '#007AFF' : '#FF6B6B' }
        ]}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <Text style={styles.dateText}>{item.date} {item.time}</Text>
      </View>
      
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.itemName}</Text>
        <Text style={styles.itemDetails}>
          수량: {item.quantity} | 위치: {item.location}
        </Text>
      </View>
      
      <View style={styles.itemFooter}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === '완료' ? '#28A745' : '#FFC107' }
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>입반출 내역</Text>
      </View>

      {/* 필터 버튼 */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedFilter === filter.key && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === filter.key && styles.filterButtonTextActive
            ]}>
              {filter.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 통계 정보 */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredData.length}</Text>
          <Text style={styles.statLabel}>총 건수</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {filteredData.filter(item => item.type === '반입').length}
          </Text>
          <Text style={styles.statLabel}>반입</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {filteredData.filter(item => item.type === '반출').length}
          </Text>
          <Text style={styles.statLabel}>반출</Text>
        </View>
      </View>

      {/* 내역 목록 */}
      <FlatList
        data={filteredData}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.historyList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6C757D',
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
  filterContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  itemContent: {
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
  },
  itemFooter: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default History; 