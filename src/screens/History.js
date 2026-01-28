import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const sampleData = [
  { id: '1', shipper: '(주)글로벌무역', blNumber: 'CKCOQZH0005739', importQty: 5, exportQty: 3 },
  { id: '2', shipper: '대한상사', blNumber: 'CFA0602466', importQty: 12, exportQty: 0 },
  { id: '3', shipper: '한진해운', blNumber: 'HDMUDALA41109', importQty: 8, exportQty: 8 },
  { id: '4', shipper: '(주)물류혁신', blNumber: 'KOCU4069568', importQty: 2, exportQty: 1 },
  { id: '5', shipper: '신세계푸드', blNumber: 'BSIU8068827', importQty: 20, exportQty: 15 },
  { id: '6', shipper: '삼성전자', blNumber: 'CAIU9630424', importQty: 100, exportQty: 45 },
];

const History = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={[styles.cell, { flex: 2 }]}>
        <Text style={styles.cellText} numberOfLines={1}>{item.shipper}</Text>
      </View>
      <View style={[styles.cell, { flex: 3 }]}>
        <Text style={styles.cellText} numberOfLines={1}>{item.blNumber}</Text>
      </View>
      <View style={[styles.cell, { flex: 1.2 }]}>
        <Text style={[styles.cellText, styles.qtyText]}>{item.importQty}</Text>
      </View>
      <View style={[styles.cell, { flex: 1.2 }]}>
        <Text style={[styles.cellText, styles.qtyText]}>{item.exportQty}</Text>
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
          <View style={[styles.headerCell, { flex: 3 }]}>
            <Text style={styles.headerCellText}>BL넘버</Text>
          </View>
          <View style={[styles.headerCell, { flex: 1.2 }]}>
            <Text style={styles.headerCellText}>반입수</Text>
          </View>
          <View style={[styles.headerCell, { flex: 1.2 }]}>
            <Text style={styles.headerCellText}>반출수</Text>
          </View>
        </View>

        {/* 데이터 리스트 */}
        <FlatList
          data={sampleData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
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
});

export default History;
