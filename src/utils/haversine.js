/**
 * Calculates the haversine distance between two points on the Earth.
 * @param {{lat: number, lng: number}} coords1 - The coordinates of the first point.
 * @param {{lat: number, lng: number}} coords2 - The coordinates of the second point.
 * @returns {number} The distance in kilometers.
 */
export function haversineDistance(coords1, coords2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  const R = 6371; // Earth's radius in kilometers

  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
}
