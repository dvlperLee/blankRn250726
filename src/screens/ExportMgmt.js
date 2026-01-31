import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { commonAPI } from '../services/apiService';

const ExportMgmt = ({ navigation }) => {
    const [exportDate, setExportDate] = useState(new Date().toISOString().split('T')[0]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modifiedItems, setModifiedItems] = useState({});

    // 조회 함수
    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await commonAPI.selectExportMgmt({ exportDate });

            // 임시 데이터 (이미지 기반 샘플 구성 참고)
            const mockResult = [
                { id: '1', consignorId: 'ABC', containerNumber: 'CKCU1122334', vehicleNo: '1111', exportTime: '10:00' },
                { id: '2', consignorId: 'XYZ', containerNumber: 'CKCU4455667', vehicleNo: '2222', exportTime: '11:30' },
            ];

            const resultData = Array.isArray(response) ? response : (response.list || mockResult);
            setData(resultData);
            setModifiedItems({}); // 조회 시 수정 내역 초기화
        } catch (error) {
            Alert.alert('오류', '데이터 조회에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 인라인 수정 처리
    const handleEdit = (id, field, value) => {
        setData(prevData =>
            prevData.map(item => item.id === id ? { ...item, [field]: value } : item)
        );
        setModifiedItems(prev => ({ ...prev, [id]: true }));
    };

    // 저장 함수
    const handleSave = async () => {
        const updatedData = data.filter(item => modifiedItems[item.id]);
        if (updatedData.length === 0) {
            Alert.alert('알림', '수정된 항목이 없습니다.');
            return;
        }

        try {
            setLoading(true);
            await commonAPI.updateExportMgmt(updatedData);
            Alert.alert('성공', '저장이 완료되었습니다.');
            setModifiedItems({});
        } catch (error) {
            Alert.alert('오류', '저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.tableRow}>
            <View style={[styles.cell, { flex: 1.5 }]}>
                <Text style={styles.cellText}>{item.consignorId}</Text>
            </View>
            <View style={[styles.cell, { flex: 2.5 }]}>
                <Text style={styles.cellText}>{item.containerNumber}</Text>
            </View>
            <View style={[styles.cell, { flex: 1.5, paddingHorizontal: 5 }]}>
                <TextInput
                    style={styles.cellInput}
                    value={item.vehicleNo}
                    onChangeText={(val) => handleEdit(item.id, 'vehicleNo', val)}
                    keyboardType="numeric"
                />
            </View>
            <View style={[styles.cell, { flex: 1.5, paddingHorizontal: 5 }]}>
                <TextInput
                    style={styles.cellInput}
                    value={item.exportTime}
                    onChangeText={(val) => handleEdit(item.id, 'exportTime', val)}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>◀</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>반출관리</Text>
            </View>

            {/* 필터 영역 */}
            <View style={styles.filterArea}>
                <Text style={styles.filterLabel}>반출날짜</Text>
                <TextInput
                    style={styles.dateInput}
                    value={exportDate}
                    onChangeText={setExportDate}
                    placeholder="YYYY-MM-DD"
                />
                <TouchableOpacity style={styles.actionButton} onPress={handleSearch}>
                    <Text style={styles.buttonText}>조회</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
                    <Text style={styles.buttonText}>저장</Text>
                </TouchableOpacity>
            </View>

            {/* 테이블 영역 */}
            <View style={styles.content}>
                <View style={styles.tableHeader}>
                    <View style={[styles.headerCell, { flex: 1.5 }]}>
                        <Text style={styles.headerCellText}>화주</Text>
                    </View>
                    <View style={[styles.headerCell, { flex: 2.5 }]}>
                        <Text style={styles.headerCellText}>컨넘버</Text>
                    </View>
                    <View style={[styles.headerCell, { flex: 1.5 }]}>
                        <Text style={styles.headerCellText}>차량번호</Text>
                    </View>
                    <View style={[styles.headerCell, { flex: 1.5 }]}>
                        <Text style={styles.headerCellText}>반출시간</Text>
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#4A5568" />
                ) : (
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>조회된 데이터가 없습니다.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        height: 60,
        backgroundColor: '#EDF2F7',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#CBD5E0',
        marginTop: 40,
    },
    backButton: { padding: 5 },
    backText: { fontSize: 20, color: '#333' },
    headerTitle: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#333', marginRight: 25 },

    filterArea: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F7FAFC',
    },
    filterLabel: { fontSize: 18, fontWeight: 'bold', marginRight: 10 },
    dateInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#333',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
        fontSize: 16,
    },
    actionButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#333',
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginRight: 5,
    },
    saveButton: { marginRight: 0 },
    buttonText: { fontSize: 16, fontWeight: 'bold' },

    content: { flex: 1 },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#718096',
        height: 45,
    },
    headerCell: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#fff',
    },
    headerCellText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    list: { flexGrow: 1 },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#CBD5E0',
        backgroundColor: '#fff',
        minHeight: 50,
    },
    cell: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#CBD5E0',
    },
    cellText: { fontSize: 14, color: '#333' },
    cellInput: {
        width: '100%',
        textAlign: 'center',
        fontSize: 14,
        color: '#333',
        paddingVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
    },
    emptyContainer: { padding: 40, alignItems: 'center' },
    emptyText: { color: '#A0AEC0', fontSize: 16 },
});

export default ExportMgmt;
