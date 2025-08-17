import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const Management = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>입반출 관리</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Import')}
        >
          <Text style={styles.menuText}>반입</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Export')}
        >
          <Text style={styles.menuText}>반출</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#28A745',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backText: { color: '#fff', fontSize: 16 },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: 'bold' },

  content: { flex: 1, paddingTop: 30 },
  menuItem: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuText: { fontSize: 18, fontWeight: '600', color: '#333' },
});

export default Management;
