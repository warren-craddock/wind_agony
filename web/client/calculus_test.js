import chai from 'chai';
chai.should();

import { Bilerp } from './calculus.js';

describe('Bilerp', () => {
  it('should work for 2x2 image', () => {
    if (document === undefined) {
      chai.assert('This test can only be run from a browser.');
    }

    const kNumPoints = 2;
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    let vector_field = context.createImageData(kNumPoints, kNumPoints);

    // Top-left corner.
    let pixel = 0;
    vector_field.data[pixel * 4 + 0] = 1.0;
    vector_field.data[pixel * 4 + 1] = 0.0;
    vector_field.data[pixel * 4 + 2] = 0.0;
    vector_field.data[pixel * 4 + 3] = 0.0;

    // Top-right corner.
    pixel = 1;
    vector_field.data[pixel * 4 + 0] = 10.0;
    vector_field.data[pixel * 4 + 1] = 0.0;
    vector_field.data[pixel * 4 + 2] = 0.0;
    vector_field.data[pixel * 4 + 3] = 0.0;

    // Bottom-left corner.
    pixel = 2;
    vector_field.data[pixel * 4 + 0] = 20.0;
    vector_field.data[pixel * 4 + 1] = 0.0;
    vector_field.data[pixel * 4 + 2] = 0.0;
    vector_field.data[pixel * 4 + 3] = 0.0;

    // Bottom-right corner.
    pixel = 3;
    vector_field.data[pixel * 4 + 0] = 200.0;
    vector_field.data[pixel * 4 + 1] = 0.0;
    vector_field.data[pixel * 4 + 2] = 0.0;
    vector_field.data[pixel * 4 + 3] = 0.0;

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
    result.should.deep.equal([expected, 0.0, 0.0, 0.0]);
  });
});
