import * as Location from 'expo-location';

export type GeoResult = {
  lat: number;
  lng: number;
  address: string;
};

/** Request permission, get current position, and reverse-geocode to an Azerbaijani-style address. */
export async function getCurrentPlace(): Promise<GeoResult> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Məkan icazəsi verilmədi');
  }
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const { latitude, longitude } = pos.coords;
  let address = '';
  try {
    const places = await Location.reverseGeocodeAsync({ latitude, longitude });
    const p = places[0];
    if (p) {
      address = [p.street, p.name && p.name !== p.street ? p.name : null, p.district || p.city]
        .filter(Boolean)
        .join(', ');
    }
  } catch {
    // reverse geocoding can fail offline — fall back to coords
  }
  if (!address) address = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  return { lat: latitude, lng: longitude, address };
}
