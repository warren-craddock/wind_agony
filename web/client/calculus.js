// Bilinear interpolation for a single point in a vector field.
//
// |point| is a dictionary contining two fields, lat and lon.
//
// |bounding_box| is a dictionary containing fields min_lon, max_lon, min_lat,
// max_lat, and perhaps others.
//
// |vector_field| is given as an HTML5 ImageData object that is assumed to fit
// the same bounding box.
function Bilerp(point, bounding_box, vector_field) {
  // Here's a plot of the simplest case. |Q| represents the given pixel data.
  // The bounding box is [-10, 10] for both latitude and longitude. That means
  // the pitch (width) of each pixel is 10 degrees in each axis.
  //
  // Points labeled |o| are out of bounds -- we cannot interpolate there.
  // So we will just return the value of the containing pixel for those points.
  //
  // Points labled |i| are in bounds.
  //
  // -10      -5        0         5        10
  // ---------------------------------------- 10
  // |                  |                   |
  // |   o              |               o   |
  // |                  |                   |
  // |        Q12   i   |    i   Q22        | 5
  // |                  |                   |
  // |              i   |    i              |
  // |                  |                   |
  // ---------------------------------------- 0
  // |                  |                   |
  // |              i   |    i              |
  // |                  |                   |
  // |        Q11   i   |    i   Q21        | -5
  // |                  |                   |
  // |   o              |               o   |
  // |                  |                   |
  // ---------------------------------------- -10

  // Compute pixel pitch.
  const lon_pixel_pitch = bounding_box.lon_range / vector_field.width;
  const lat_pixel_pitch = bounding_box.lat_range / vector_field.height;

  // Find the four pixels of the vector field that surround the given point.
  const lon1_index = Math.floor(
    (point.lon - bounding_box.min_lon - lon_pixel_pitch / 2.0) / lon_pixel_pitch);
  const lon1 = (lon1_index - 0.5) * lon_pixel_pitch;
  const lon2_index = lon1_index + 1;
  const lon2 = (lon2_index - 0.5) * lon_pixel_pitch;

  const lat1_index = Math.floor(
    (point.lat - bounding_box.min_lat - lat_pixel_pitch / 2.0) / lat_pixel_pitch);
  const lat1 = (lat1_index - 0.5) * lat_pixel_pitch;
  const lat2_index = lat1_index + 1;
  const lat2 = (lat2_index - 0.5) * lat_pixel_pitch;

  // If the point is out of bounds, return zero speed.
  // TODO(wcraddock:) This introduces a small error at the edge of the map.
  // Might be worth fixing.
  const lon_oob = lon1_index < 0 || lon2_index >= vector_field.width;
  const lat_oob = lat1_index < 0 || lat2_index >= vector_field.height;
  if (lon_oob || lat_oob) {
    return {bearing: 0, speed:0};
  }

  // Extract the data for each surrounding pixel.
  const select_fn = (lon, lat) => {
    const index = vector_field.width * lat + lon;
    return vector_field[index];
  }
  const Q11 = select_fn(lon1_index, lat1_index);
  const Q12 = select_fn(lon1_index, lat2_index);
  const Q21 = select_fn(lon2_index, lat1_index);
  const Q22 = select_fn(lon2_index, lat2_index);

  // Interpolate along the lon direction.
  let R1 = {};
  R1.bearing = ((lon2 - point.lon) / lon_pixel_pitch) * Q11.bearing
             + ((point.lon - lon1) / lon_pixel_pitch) * Q21.bearing;
  R1.speed = ((lon2 - point.lon) / lon_pixel_pitch) * Q11.speed
           + ((point.lon - lon1) / lon_pixel_pitch) * Q21.speed;

  let R2 = {};
  R2.bearing = ((lon2 - point.lon) / lon_pixel_pitch) * Q12.bearing
             + ((point.lon - lon1) / lon_pixel_pitch) * Q22.bearing;
  R2.speed = ((lon2 - point.lon) / lon_pixel_pitch) * Q12.speed
           + ((point.lon - lon1) / lon_pixel_pitch) * Q22.speed;

  // Interpolate along the lat direction.
  let P = {};
  P.bearing = ((lat2 - point.lat) / lat_pixel_pitch) * R1.bearing
            + ((point.lat - lat1) / lat_pixel_pitch) * R2.bearing;
  P.speed = ((lat2 - point.lat) / lat_pixel_pitch) * R1.speed
          + ((point.lat - lat1) / lat_pixel_pitch) * R2.speed;

  return P;
}

// Computes the line integral of the given curve through the given vector field.
//
// At each point along the curve, the dot product between the curve and the
// vector field is computed. The total line integral is sum of the dot products.
//
// |curve| is given as an array of lat/lon points.
//
// |bounding_box| is a dictionary containing fields min_lon, max_lon, min_lat,
// max_lat, and perhaps others.
//
// |vector_field| is given as an HTML5 ImageData object that is assumed to fit
// the same bounding box. Points in the vector field are computed with bilinear
// interpolation. The |vector_field| may be of arbitrary resolution.
//
// TODO(wcraddock): This method computes the line integral on a 2D Euclidean
// plane, which is only correct if the curve's geographical extent is rather
// small. This is usually true for a single day's bike riding, but it would be
// more correct to compute this on the surface of a 2-sphere.
function LineIntegral(curve, bounding_box, vector_field) {
  let integral = 0.0;

  // Iterate along the curve, including only the penultimate point.
  for (let i = 0; i < curve.length - 1; i += 1) {
    // Use the first difference as an approximation to the tangent vector
    // along the curve.
    const motion_vector = {
      lon: curve[i + 1].lon - curve[i].lon,
      lat: curve[i + 1].lat - curve[i].lat
    };

    // Interpolate the wind speed and heading at the point.
    const wind_info = Bilerp(curve[i], bounding_box, vector_field);

    // Convert the wind speed and heading into lat/lon. Remember that wind
    // bearing is reported as the direction the wind originates. If one rides
    // with a tailwind, the dot product with be -1.
    const wind_vector = {
      lon: wind_info.speed * Math.sin(wind_info.bearing * Math.PI / 180.0),
      lat: wind_info.speed * Math.cos(wind_info.bearing * Math.PI / 180.0)
    }

    // Compute the dot product of the wind and motion vectors.
    const dot_product = motion_vector.lon * wind_vector.lon
                      + motion_vector.lat * wind_vector.lat;

    // Accumulate the integral.
    integral += dot_product;
  }

  return integral;
}

export { Bilerp, LineIntegral };
