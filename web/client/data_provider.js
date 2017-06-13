const async = require('async');
const parseString = require('xml2js').parseString;
const request = require('superagent');

const DARK_SKY_API_KEY = "24490cda9c1db43d3e46237c0ecdd2ba";

function ReadTcxFile(evt, callback) {
  const file = evt.target.files[0];
  if (!file) {
    return;
  }

  let reader = new FileReader();
  reader.onload = function(evt) {
    // Convert the TCX file from XML to JSON.
    const xml = evt.target.result;
    parseString(xml, callback);
  };

  reader.readAsText(file);
}

function GetTrackpointsFromTcx(tcx) {
  const trackpoints =
    tcx.TrainingCenterDatabase.Activities[0].Activity[0].Lap[0].Track[0].Trackpoint;

  // Filter out any trackpoints that don't have lat/lon.
  return trackpoints.filter(tp => tp.Position !== undefined);
}

function ComputeBoundingBox(tcx) {
  // Extract the list of trackpoints from the TCX object.
  const trackpoints = GetTrackpointsFromTcx(tcx);

  // Reduce the trackpoints to compute their bounding box.
  const initial_value = {min_lon: Infinity, max_lon: -Infinity,
                         min_lat: Infinity, max_lat: -Infinity};
  const reduce_fn = (acc, tp) => {
    acc.min_lon = Math.min(acc.min_lon, tp.Position[0].LongitudeDegrees[0]);
    acc.max_lon = Math.max(acc.max_lon, tp.Position[0].LongitudeDegrees[0]);
    acc.min_lat = Math.min(acc.min_lat, tp.Position[0].LatitudeDegrees[0]);
    acc.max_lat = Math.max(acc.max_lat, tp.Position[0].LatitudeDegrees[0]);
    return acc;
  }
  let bounding_box = trackpoints.reduce(reduce_fn, initial_value);

  // Compute bounding box width and height.
  bounding_box.lat_range = bounding_box.max_lat - bounding_box.min_lat;
  bounding_box.lon_range = bounding_box.max_lon - bounding_box.min_lon;

  return bounding_box;
}

// |date_time| is represented as FIXME
//
// |bounding_box| should be an array of [min_lon, max_lon, min_lat, max_lat].
//
// The wind vector field is sampled on grid of points x points, and returned as
// an image object. The HSV value of each pixel encodes the wind speed and
// heading. Hue (0-255) represents wind heading, while value (0-255) represents
// speed (FIXME scale). Saturation is always 255.
//
// The image returned by this method can be drawn on-screen for visualization
// purposes, or it can be upscaled / downscaled and used for vector calculus.
function GetDarkSkyWindVectorField(date_time, bounding_box, points, callback) {
  // FIXME use a different number of points for lat and lon?
  let index = 0;
  let grid_points = [];
  for (let lat_i = 0; lat_i < points; lat_i += 1) {
    for (let lon_i = 0; lon_i < points; lon_i += 1) {
      // FIXME compute pixel centers.
      const lat = bounding_box.min_lat
                + lat_i * (bounding_box.lat_range / points);
      const lon = bounding_box.min_lon
                + lon_i * (bounding_box.lon_range / points);

      grid_points.push([index, lat, lon]);

      index += 1;
    }
  }

  // Helper method; asynchronously gets data for a specific lat/lon from the
  // Dark Sky API.
  const DarkSkyApiRequest = (args, callback) => {
    let [index, lat, lon] = args;
    console.log('Dark sky API request for index', index, 'lat', lat, 'lon', lon);

    // TODO(wcraddock): Stop using this CORS hack.
    const url = `https://crossorigin.me/https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${lat},${lon}`;
    request
       .get(url)
       .end(function(err, res){
          if (err) callback(err, res);
          else callback(err, JSON.parse(res.text));
       });
  }

  // Request data for all grid points in parallel.
  async.map(grid_points, DarkSkyApiRequest, function(err, results) {
    if (err) {
      console.log('Error getting data from Dark Sky API', err);
    }

    // Create an offscreen canvas that will contain the output image.
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let image_data = context.createImageData(points, points);

    // Copy the wind heading and speed information into the output image.
    for (let i = 0; i < grid_points.length; i += 1) {
      const index = grid_points[i][0];
      const bearing = results[i].daily.data[0].windBearing;
      const speed = results[i].daily.data[0].windSpeed;
      console.log('index', index, 'bearing', bearing, 'speed', speed);

      // Fill in the image pixel with the wind information. Pack the wind
      // bearing [0-360) degrees into the range [0-256) in the red channel. Pack the
      // wind speed [0-50) mph into the green channel. This is a bit of a hack,
      // but I want to preserve more precision in the speed.
      const kWindHeadingScale = (255.0 / 360.0);
      const kWindSpeedScale = (255.0 / 50.0);
      image_data.data[index * 4 + 0] = bearing * kWindHeadingScale;
      image_data.data[index * 4 + 1] = Math.max(255, speed * kWindSpeedScale);
      image_data.data[index * 4 + 2] = 0;
      image_data.data[index * 4 + 3] = 128;
    }

    console.log('image_data', image_data);
    callback(image_data);
  });
}

export {
  ReadTcxFile,
  ComputeBoundingBox,
  GetTrackpointsFromTcx,
  GetDarkSkyWindVectorField
};
