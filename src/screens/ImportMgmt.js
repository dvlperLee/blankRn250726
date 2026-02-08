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
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const ImportMgmt = ({ navigation }) => {
    const [importDate, setImportDate] = useState(new Date().toLocaleDateString('en-CA'));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modifiedItems, setModifiedItems] = useState({});

    // 달력 관련 상태
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [pickerDate, setPickerDate] = useState(new Date());

    // 화면 진입 시 자동 조회
    useEffect(() => {
        handleSearch();
    }, []);

    // 조회 함수
    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await commonAPI.selectImportMgmtList(importDate);

            const rawData = Array.isArray(response) ? response : [];
            // 각 항목에 고유 ID 보장 (ID가 없거나 중복될 경우 대비하여 index와 결합)
            const resultData = rawData.map((item, index) => ({
                ...item,
                id: (item.id !== undefined && item.id !== null) ? `${item.id}-${index}` : `item-${index}`
            }));

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

    // 시간 입력 유효성 검사 (HHMM) - 단계별 체크
    const handleTimeChange = (id, field, value) => {
        const numericValue = value.replace(/[^0-9]/g, '');

        if (numericValue.length >= 1) {
            const firstDigit = parseInt(numericValue[0], 10);
            if (firstDigit > 2) {
                Alert.alert('오류', '올바른 시간(00-23)의 첫 자리를 입력해주세요.');
                return;
            }
        }

        if (numericValue.length >= 2) {
            const hh = parseInt(numericValue.substring(0, 2), 10);
            if (hh > 23) {
                Alert.alert('오류', '시간은 00시에서 23시 사이여야 합니다.');
                return;
            }
        }

        if (numericValue.length >= 3) {
            const thirdDigit = parseInt(numericValue[2], 10);
            if (thirdDigit > 5) {
                Alert.alert('오류', '분은 00분에서 59분 사이여야 합니다.');
                return;
            }
        }
        handleEdit(id, field, numericValue);
    };

    // 달력 날짜 선택 처리
    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            const formattedDate = selectedDate.toLocaleDateString('en-CA');
            if (selectedRowId === 'top') {
                setImportDate(formattedDate);
            } else if (selectedRowId) {
                handleEdit(selectedRowId, 'shortBringInDate', formattedDate);
            }
        }
    };

    const openDatePicker = (id, currentVal) => {
        setSelectedRowId(id);
        const initialDate = currentVal ? new Date(currentVal) : new Date();
        setPickerDate(isNaN(initialDate.getTime()) ? new Date() : initialDate);
        setShowDatePicker(true);
    };

    // 저장 함수
    const handleSave = async () => {
        const selectedItems = data.filter(item => modifiedItems[item.id]);
        if (selectedItems.length === 0) {
            Alert.alert('알림', '수정된 항목이 없습니다.');
            return;
        }

        // 시간 4자리 유효성 검사
        const invalidTimeItem = selectedItems.find(item => item.bringInTime && item.bringInTime.length !== 4);
        if (invalidTimeItem) {
            Alert.alert('오류', '시간은 반드시 4자리(HHMM)여야 합니다.');
            return;
        }

        try {
            setLoading(true);
            // 삭제예정
            const userId = 'lee';
            //const userId = await AsyncStorage.getItem('userId');

            // 전송 데이터 준비 (userId 추가 및 id에서 index 접미사 제거 등 필요시 처리)
            // 여기서는 단순히 userId를 각 항목에 추가합니다.
            const updatedData = selectedItems.map(item => ({
                ...item,
                userId: userId
            }));

            await commonAPI.updateImportMgmtList(updatedData);
            Alert.alert('성공', '저장이 완료되었습니다.');
            setModifiedItems({});
            handleSearch(); // 저장 후 목록 새로고침
        } catch (error) {
            Alert.alert('오류', '저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.tableRow}>
            <View style={[styles.cell, { flex: 1.5 }]}>
                <Text style={styles.cellText}>{item.consignorName}</Text>
            </View>
            <View style={[styles.cell, { flex: 3 }]}>
                <Text style={styles.cellText}>{item.containerNumber}</Text>
            </View>
            <View style={[styles.cell, { flex: 2 }]}>
                <TextInput
                    style={styles.cellInput}
                    value={item.bringInRegistrationNumber}
                    maxLength={4}
                    onChangeText={(val) => handleEdit(item.id, 'bringInRegistrationNumber', val)}
                    keyboardType="numeric"
                />
            </View>
            <View style={[styles.cell, { flex: 2.5, paddingHorizontal: 3, paddingVertical: 3 }]}>
                <View style={{ flex: 1, width: '100%', borderRadius: 4, overflow: 'hidden', backgroundColor: '#E2E8F0' }}>
                    <TouchableOpacity
                        style={[styles.subCell, { borderBottomWidth: 1, borderBottomColor: '#CBD5E0' }]}
                        onPress={() => openDatePicker(item.id, item.shortBringInDate)}
                    >
                        <Text style={styles.cellText}>{item.shortBringInDate || '-'}</Text>
                    </TouchableOpacity>
                    <View style={styles.subCell}>
                        <TextInput
                            style={[styles.cellInput, { backgroundColor: 'transparent', paddingVertical: 0, height: '100%' }]}
                            value={item.bringInTime}
                            maxLength={4}
                            onChangeText={(val) => handleTimeChange(item.id, 'bringInTime', val)}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>반입관리</Text>
            </View>

            {/* 필터 영역 */}
            <View style={styles.filterArea}>
                <Text style={styles.filterLabel}>반입날짜</Text>
                <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => openDatePicker('top', importDate)}
                >
                    <Text style={{ fontSize: 16, color: '#333' }}>{importDate}</Text>
                </TouchableOpacity>
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
                    <View style={[styles.headerCell, { flex: 3 }]}>
                        <Text style={styles.headerCellText}>컨넘버</Text>
                    </View>
                    <View style={[styles.headerCell, { flex: 2 }]}>
                        <Text style={styles.headerCellText}>차량번호</Text>
                    </View>
                    <View style={[styles.headerCell, { flex: 2.5 }]}>
                        <Text style={styles.headerCellText}>일자/시간</Text>
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

            {showDatePicker && (
                <DateTimePicker
                    value={pickerDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        height: 60,
        backgroundColor: '#E2E8F0',
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
        backgroundColor: '#EDF2F7',
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
        backgroundColor: '#808080',
        height: 45,
    },
    headerCell: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#fff',
    },
    headerCellText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    list: { flexGrow: 1, paddingBottom: 45 },
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
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
    },
    subCell: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: { padding: 40, alignItems: 'center' },
    emptyText: { color: '#A0AEC0', fontSize: 16 },
});

export default ImportMgmt;
