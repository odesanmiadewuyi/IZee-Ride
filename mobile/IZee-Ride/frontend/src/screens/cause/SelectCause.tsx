import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import { CauseApi } from '../../api/endpoints';

export default function SelectCause({ navigation }: any){
  const [causes, setCauses] = useState<any[]>([]);
  useEffect(()=>{ CauseApi.list().then(res=>setCauses(res.data)).catch(()=>{}); },[]);
  return (
    <View style={styles.container}>
      <Header title="Select a Cause" />
      <FlatList
        data={causes}
        keyExtractor={(it)=>it.id}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.causeItem} onPress={()=>navigation.navigate('CauseDetails', { id: item.id })}>
            <Text style={styles.causeTitle}>{item.title}</Text>
            <Text style={styles.causeAmount}>NGN {item.amountRequired}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity onPress={()=>navigation.navigate('CauseDetails', {})}>
        <Text style={styles.addNew}>+ Add new cause</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
  },
  causeItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
  },
  causeTitle: {
    fontWeight: 'bold',
  },
  causeAmount: {
    color: '#666',
  },
  addNew: {
    color: '#2F62F0',
    textAlign: 'center',
    marginTop: 16,
  },
});
