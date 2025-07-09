import mongoose from 'mongoose';

const SiteStatusSchema = new mongoose.Schema({
  isSiteActive: {
    type: Boolean,
    required: true,
    default: true,
  },
});

export default mongoose.models.SiteStatus || mongoose.model('SiteStatus', SiteStatusSchema);
