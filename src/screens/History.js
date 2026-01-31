import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { commonAPI } from '../services/apiService';

// sampleData 제거

const History = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await commonAPI.selectHistory();
      // 백엔드 응답 구조에 따라 조정 필요 (예: result.data 또는 result)
      // 여기서는 result가 배열이라고 가정하거나 result.list 등을 확인해야 함
      setData(Array.isArray(result) ? result : (result.list || []));
    } catch (err) {
      setError(err.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={[styles.cell, { flex: 2 }]}>
        <Text style={styles.cellText} numberOfLines={1}>{item.consignorId}</Text>
      </View>
      <View style={[styles.cell, { flex: 5 }]}>
        <Text style={styles.cellText} numberOfLines={1}>{item.blNumber}</Text>
      </View>
      <View style={[styles.cell, { flex: 1 }]}>
        <Text style={[styles.cellText, styles.qtyText]}>{item.containCount}</Text>
      </View>
      <View style={[styles.cell, { flex: 1 }]}>
        <Text style={[styles.cellText, styles.qtyText]}>{item.inCount}</Text>
      </View>
      <View style={[styles.cell, { flex: 1 }]}>
        <Text style={[styles.cellText, styles.qtyText]}>{item.outCount}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 고정 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>입반출 내역</Text>
      </View>

      <View style={styles.content}>
        {/* 테이블 헤더 컬럼 */}
        <View style={styles.tableHeader}>
          <View style={[styles.headerCell, { flex: 2 }]}>
            <Text style={styles.headerCellText}>화주</Text>
          </View>
          <View style={[styles.headerCell, { flex: 5 }]}>
            <Text style={styles.headerCellText}>BL넘버</Text>
          </View>
          <View style={[styles.headerCell, { flex: 1 }]}>
            <Text style={styles.headerCellText}>컨</Text>
          </View>
          <View style={[styles.headerCell, { flex: 1 }]}>
            <Text style={styles.headerCellText}>반입</Text>
          </View>
          <View style={[styles.headerCell, { flex: 1 }]}>
            <Text style={styles.headerCellText}>반출</Text>
          </View>
        </View>

        {/* 데이터 리스트 */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#4A5568" />
            <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchHistory}>
              <Text style={styles.retryText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>조회된 내역이 없습니다.</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    backgroundColor: '#4A5568',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 30,
  },
  content: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E0',
  },
  headerCell: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  headerCellText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  list: {
    paddingBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    paddingVertical: 15,
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cellText: {
    fontSize: 14,
    color: '#4A5568',
  },
  qtyText: {
    fontWeight: '500',
    color: '#2B6CB0',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#4A5568',
    fontSize: 16,
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4A5568',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    paddingTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: '#A0AEC0',
    fontSize: 16,
  },
});

export default History;
