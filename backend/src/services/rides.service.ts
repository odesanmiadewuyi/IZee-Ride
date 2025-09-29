import db from "../config/knex-pg";

type RideInput = {
  userId: number;
  driverId?: number | null;
  pickupLocation: string;
  dropoffLocation: string;
  fare: number;
};

export async function createRide(input: RideInput) {
  const payload: any = {
    user_id: input.userId,
    pickup_location: input.pickupLocation,
    dropoff_location: input.dropoffLocation,
    fare: input.fare,
  };
  if (input.driverId !== undefined) {
    payload.driver_id = input.driverId;
  }

  const [ride] = await db("rides").insert(payload).returning("*");
  return ride;
}

export async function findNearbyDrivers(_lat: number, _lng: number, _radiusKm = 5) {
  // Placeholder: without geo columns we expose all drivers for now.
  const drivers = await db("drivers").select("*");
  return drivers;
}
