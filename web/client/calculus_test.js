import chai from 'chai';
chai.should();

import { Bilerp, LineIntegral } from './calculus.js';

describe('Bilerp', () => {
  it('should work for 2x2 image', () => {
    if (document === undefined) {
      chai.assert('This test can only be run from a browser.');
    }

    // Create an empty vector field.
    const kNumPoints = 2;
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let vector_field = context.createImageData(kNumPoints, kNumPoints);

    // Fill the vector field with some fixed points.
    vector_field[0] = {bearing: 1.0, speed: 0.0};
    vector_field[1] = {bearing: 10.0, speed: 0.0};
    vector_field[2] = {bearing: 20.0, speed: 0.0};
    vector_field[3] = {bearing: 200.0, speed: 0.0};

    // Simple bounding box.
    const bounding_box = {
      min_lon: -10,
      max_lon: 10,
      lon_range: 20,
      min_lat: -10,
      max_lat: 10,
      lat_range: 20,
    }

    const result = Bilerp({lat: 0, lon: 0}, bounding_box, vector_field);
    const expected = (((1 + 10) / 2.0 + (20 + 200) / 2.0)) / 2.0;
    result.should.deep.equal({bearing: expected, speed: 0.0});
  });
});

describe('LineIntegral', () => {
  it('should work for constant vector field', () => {
    if (document === undefined) {
      chai.assert('This test can only be run from a browser.');
    }

    // Create an empty vector field.
    const kNumPoints = 10;
    let vector_field = new Array(kNumPoints * kNumPoints);
    vector_field.width = kNumPoints;
    vector_field.height = kNumPoints;

    // Fill the vector field with a wind that originates in the north,
    // and blows to the south.
    vector_field.fill({bearing: 0.0, speed: 10.0});  // due south at 10 mph

    // Simple bounding box. Each pixel is one degree of lat/lon.
    const bounding_box = {
      min_lon: -10,
      max_lon: 10,
      lon_range: 20,
      min_lat: -10,
      max_lat: 10,
      lat_range: 20,
    }

    // The curve marches straight down from the north to the south of the
    // bounding box. This is a tailwind, so the line integral will be negative.
    // TODO(wcraddock): Only works in northern hemisphere.
    let curve = [];
    let lon = 0.0;
    for (let lat = bounding_box.max_lat; lat > bounding_box.min_lat; lat -= 0.1) {
      curve.push({lat, lon});
    }

    const result = LineIntegral(curve, bounding_box, vector_field);
    result.should.be.closeTo(-180.0, 0.1);
  });

  it('should work for gradient vector field', () => {
    if (document === undefined) {
      chai.assert('This test can only be run from a browser.');
    }

    const kNumPoints = 10;
    let vector_field = new Array(kNumPoints * kNumPoints);
    vector_field.width = kNumPoints;
    vector_field.height = kNumPoints;

    // Fill the vector field with a smooth gradient. The wind blows to the
    // north, and gets stronger the further south you go.
    let index = 0;
    for (let row = 0; row < kNumPoints; row += 1) {
      for (let col = 0; col < kNumPoints; col += 1) {
        vector_field[index] = {bearing: 180.0, speed: row * 1.0};

        index += 1;
      }
    }

    // Simple bounding box. Each pixel is one degree of lat/lon.
    const bounding_box = {
      min_lon: -10,
      max_lon: 10,
      lon_range: 20,
      min_lat: -10,
      max_lat: 10,
      lat_range: 20,
    }

    // The curve marches straight down from the north to the south of the
    // bounding box, into the headwind. Since this is a headwind, the line
    // integral should be positive.
    // TODO(wcraddock): Only works in northern hemisphere.
    let curve = [];
    let lon = 0.0;
    for (let lat = bounding_box.max_lat; lat > bounding_box.min_lat; lat -= 0.1) {
      curve.push({lat, lon});
    }

    const result = LineIntegral(curve, bounding_box, vector_field);
    result.should.be.closeTo(8.56, 0.1);
  });
});
