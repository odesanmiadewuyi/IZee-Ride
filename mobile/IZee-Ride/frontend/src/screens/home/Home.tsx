import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { useFocusEffect } from '@react-navigation/native';
import { WalletApi, CauseApi } from '../../api/endpoints';

interface WelcomeBonusState {
  initialAmount: number;
  balance: number;
  lastAppliedOn: string | null;
  lastAppliedAmount: number;
}

const formatCurrency = (value: number) => `NGN ${Number(value ?? 0).toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

export default function Home({ navigation }: any){
  const [balance, setBalance] = useState<number>(0);
  const [welcomeBonus, setWelcomeBonus] = useState<WelcomeBonusState>({ initialAmount: 0, balance: 0, lastAppliedOn: null, lastAppliedAmount: 0 });
  const [bonusUsedToday, setBonusUsedToday] = useState<boolean>(false);
  const [causes, setCauses] = useState<any[]>([]);

  useFocusEffect(useCallback(()=>{
    const fetchWallet = async () => {
      try {
        const res = await WalletApi.get();
        const data = res.data?.data ?? {};
        setBalance(Number(data.balance ?? 0));
        const bonusRaw = data.welcomeBonus ?? {};
        const normalized: WelcomeBonusState = {
          initialAmount: Number(bonusRaw.initialAmount ?? bonusRaw.initial_amount ?? 0),
          balance: Number(bonusRaw.balance ?? 0),
          lastAppliedOn: bonusRaw.lastAppliedOn ?? bonusRaw.last_applied_on ?? null,
          lastAppliedAmount: Number(bonusRaw.lastAppliedAmount ?? bonusRaw.last_applied_amount ?? 0),
        };
        setWelcomeBonus(normalized);
        const today = new Date().toISOString().slice(0, 10);
        const normalizedAppliedOn = normalized.lastAppliedOn ? String(normalized.lastAppliedOn) : null;
        setBonusUsedToday(Boolean(normalizedAppliedOn && normalizedAppliedOn.slice(0, 10) === today));
      } catch (err) {
        console.warn('Failed to fetch wallet', err);
      }
    };

    const fetchCauses = async () => {
      try {
        const res = await CauseApi.list();
        setCauses(res.data);
      } catch (err) {
        console.warn('Failed to fetch causes', err);
      }
    };

    fetchWallet();
    fetchCauses();
  },[]));

  const remainingPercentage = welcomeBonus.initialAmount > 0
    ? Math.round((welcomeBonus.balance / welcomeBonus.initialAmount) * 100)
    : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Wallet Balance</Text>
      <Text style={styles.balance}>{formatCurrency(balance)}</Text>

      <View style={styles.bonusCard}>
        <Text style={styles.bonusTitle}>Cash Bonus</Text>
        <Text style={styles.bonusAmount}>{formatCurrency(welcomeBonus.balance)}</Text>
        <Text style={styles.bonusMeta}>Fresh users get NGN 5,000 spread across rides.</Text>
        <View style={styles.bonusFooter}>
          <Text style={styles.bonusTag}>10% off your first ride each day</Text>
          <Text style={[styles.bonusStatus, bonusUsedToday ? styles.bonusStatusUsed : styles.bonusStatusReady]}>
            {bonusUsedToday ? 'Used today' : 'Available today'}
          </Text>
        </View>
        <Text style={styles.bonusProgress}>Remaining {remainingPercentage}% of NGN {welcomeBonus.initialAmount.toLocaleString()}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={()=>navigation.navigate('ReceiveLeftover')}>
          <Text style={styles.actionText}>Receive Leftover</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButtonPurple} onPress={()=>navigation.navigate('SendLeftover')}>
          <Text style={styles.actionTextPurple}>Send Leftover</Text>
        </TouchableOpacity>
      </View>

      <PrimaryButton title="Book a Ride" onPress={()=>navigation.navigate('BookRide')} />

      <Text style={styles.sectionTitle}>Saved Causes</Text>
      <FlatList
        data={causes}
        keyExtractor={(it)=>String(it.id ?? Math.random())}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.causeItem} onPress={()=>navigation.navigate('CauseDetails', { id: item.id })}>
            <Text style={styles.causeTitle}>{item.title}</Text>
            <Text style={styles.causeAmount}>{item.amountRequired?.toLocaleString()} NGN</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No causes yet.</Text>}
      />

      <PrimaryButton title="Add new cause" onPress={()=>navigation.navigate('CauseDetails', {})} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
  },
  label: {
    color: '#666',
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bonusCard: {
    backgroundColor: '#F4F8FF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  bonusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F62F0',
  },
  bonusAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#1A1A1A',
  },
  bonusMeta: {
    color: '#4F5B76',
    marginBottom: 12,
  },
  bonusFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bonusTag: {
    backgroundColor: '#E7EEFF',
    color: '#2F62F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontWeight: '600',
    fontSize: 12,
  },
  bonusStatus: {
    fontWeight: '600',
    fontSize: 12,
  },
  bonusStatusReady: {
    color: '#1B873F',
  },
  bonusStatusUsed: {
    color: '#D32F2F',
  },
  bonusProgress: {
    color: '#4F5B76',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#E7EEFF',
    borderRadius: 24,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  actionButtonPurple: {
    flex: 1,
    backgroundColor: '#F3E5F5',
    borderRadius: 24,
    padding: 16,
    marginLeft: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#2F62F0',
    fontWeight: 'bold',
  },
  actionTextPurple: {
    color: '#9C27B0',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 24,
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
  empty: {
    color: '#666',
  },
});

