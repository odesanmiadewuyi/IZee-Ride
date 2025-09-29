import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import { RideApi, RideRequestDto } from '../../api/endpoints';

const formatCurrency = (value: number) => `NGN ${Number(value ?? 0).toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

type RideResult = {
  id: number | null;
  fare: number;
  bonusApplied: number;
  fareAfterBonus: number;
  remainingBonus: number;
  alreadyUsedToday: boolean;
};

export default function BookRide(){
  const [pickup, setPickup] = useState('Ikeja City Mall');
  const [dropoff, setDropoff] = useState('Maryland Mall');
  const [fare, setFare] = useState('10000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RideResult | null>(null);

  const onSubmit = async () => {
    const numericFare = Number(fare);
    if (!pickup.trim() || !dropoff.trim() || Number.isNaN(numericFare) || numericFare <= 0) {
      setError('Enter pickup, dropoff and a positive fare.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload: RideRequestDto = {
        pickup_location: pickup.trim(),
        dropoff_location: dropoff.trim(),
        fare: numericFare,
      };
      const response = await RideApi.requestRide(payload);
      const ride = response.data?.ride ?? {};
      const bonus = response.data?.bonus ?? {};
      const bonusApplied = Number(ride.welcome_bonus_applied ?? bonus.applied ?? 0);
      const fareAfterBonus = Number(ride.fare_after_bonus ?? ride.fare ?? numericFare) || 0;
      const remainingBonus = Number(bonus.remaining ?? 0);
      const alreadyUsedToday = Boolean(bonus.alreadyUsedToday);

      setResult({
        id: ride.id ?? null,
        fare: Number(ride.fare ?? numericFare) || numericFare,
        bonusApplied,
        fareAfterBonus,
        remainingBonus,
        alreadyUsedToday,
      });
    } catch (err) {
      console.warn('Failed to request ride', err);
      setError('Could not book ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="New Ride" />
      <TextField label="Pickup" value={pickup} onChangeText={setPickup} placeholder="Where are you now?" />
      <TextField label="Dropoff" value={dropoff} onChangeText={setDropoff} placeholder="Where are you going?" />
      <TextField label="Estimated Fare (NGN)" value={fare} onChangeText={setFare} keyboardType="numeric" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton title="Confirm ride" onPress={onSubmit} loading={loading} />

      {result ? (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Ride summary</Text>
          <Text>Initial fare: {formatCurrency(result.fare)}</Text>
          <Text>Welcome bonus applied: {formatCurrency(result.bonusApplied)}</Text>
          <Text style={styles.summaryHighlight}>Amount to pay driver: {formatCurrency(result.fareAfterBonus)}</Text>
          <Text>Remaining bonus balance: {formatCurrency(result.remainingBonus)}</Text>
          <Text style={styles.summaryStatus}>
            {result.alreadyUsedToday
              ? 'Bonus already used today - full fare charged.'
              : 'Bonus applied to this ride (1 ride daily).'}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
  },
  error: {
    color: '#D32F2F',
    marginBottom: 12,
  },
  summary: {
    marginTop: 24,
    backgroundColor: '#F4F8FF',
    borderRadius: 24,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryHighlight: {
    marginTop: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  summaryStatus: {
    marginTop: 16,
    color: '#4F5B76',
    fontStyle: 'italic',
  },
});
