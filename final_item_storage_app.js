import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Modal, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const ItemStorageApp = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: '', location: '', image: null, tags: [] });
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 从后端获取物品数据
  useEffect(() => {
    fetchItems();
  }, []);

  // 搜索功能
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  // 获取物品列表
  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
      setFilteredItems(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log('获取物品列表失败:', error);
      setIsLoading(false);
    }
  };

  // 添加新物品
  const addItem = async () => {
    if (!newItem.name || !newItem.category || !newItem.location) {
      Alert.alert('错误', '请填写完整信息');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/items', newItem);
      setItems([...items, response.data]);
      setFilteredItems([...items, response.data]);
      setNewItem({ name: '', category: '', location: '', image: null, tags: [] });
      setModalVisible(false);
      Alert.alert('成功', '物品添加成功');
    } catch (error) {
      console.log('添加物品失败:', error);
      Alert.alert('错误', '添加物品失败');
    }
  };

  // 语音播报功能
  const speakLocation = async (location) => {
    try {
      // 使用浏览器语音合成API
      const utterance = new SpeechSynthesisUtterance(`您的物品位于 ${location}`);
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.log('语音播报失败:', error);
    }
  };

  // 选择图片
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewItem({ ...newItem, image: result.assets[0].uri });
    }
  };

  // 渲染物品列表
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.image && <Image source={{ uri: item.image }} style={styles.itemImage} />}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemLocation}>{item.location}</Text>
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>{tag}</Text>
            ))}
          </View>
        )}
      </View>
      <TouchableOpacity 
        style={styles.speakButton}
        onPress={() => speakLocation(item.location)}
      >
        <Text style={styles.speakButtonText}>🔊</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>物品收纳助手</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="搜索物品..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        style={styles.itemList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>未找到匹配的物品</Text>
        }
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ 添加物品</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加新物品</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="物品名称"
              value={newItem.name}
              onChangeText={(text) => setNewItem({ ...newItem, name: text })}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="类别"
              value={newItem.category}
              onChangeText={(text) => setNewItem({ ...newItem, category: text })}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="位置"
              value={newItem.location}
              onChangeText={(text) => setNewItem({ ...newItem, location: text })}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="标签（逗号分隔）"
              value={newItem.tags.join(', ')}
              onChangeText={(text) => setNewItem({ ...newItem, tags: text.split(',').map(tag => tag.trim()) })}
            />
            
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Text style={styles.imagePickerButtonText}>
                {newItem.image ? '更换图片' : '选择图片'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={addItem}
              >
                <Text style={styles.modalButtonTextPrimary}>添加</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  itemList: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  itemLocation: {
    fontSize: 14,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#007AFF',
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  speakButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakButtonText: {
    fontSize: 20,
    color: 'white',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  imagePickerButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePickerButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  modalButtonPrimary: {
    backgroundColor: '#007AFF',
    marginRight: 0,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtonTextPrimary: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ItemStorageApp;