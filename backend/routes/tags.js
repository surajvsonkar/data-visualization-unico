import express from 'express';
import Tag from '../models/Tag.js';

const router = express.Router();

// POST /api/tags - Add a new tag for a state
router.post('/', async (req, res) => {
  try {
    const { state_code, tag_name } = req.body;
    
    if (!state_code || !tag_name) {
      return res.status(400).json({ message: 'State code and tag name are required' });
    }
    
    const newTag = new Tag({
      state_code,
      tag_name,
      upvotes: 0
    });
    
    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/tags/:stateCode - Get all tags for a state, sorted by upvotes
router.get('/:stateCode', async (req, res) => {
  try {
    const { stateCode } = req.params;
    const tags = await Tag.find({ state_code: stateCode }).sort({ upvotes: -1 });
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/tags/upvote/:tagId - Increment a tag's upvote count
router.put('/upvote/:tagId', async (req, res) => {
  try {
    const { tagId } = req.params;
    const tag = await Tag.findById(tagId);
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    
    tag.upvotes += 1;
    const updatedTag = await tag.save();
    
    res.json(updatedTag);
  } catch (error) {
    console.error('Error upvoting tag:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;