import mongoose from 'mongoose';

const geoJsonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const GeoJson = mongoose.model('GeoJson', geoJsonSchema);

export default GeoJson;