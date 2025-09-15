const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const Vote = require('../models/Vote');
const mongoose = require('mongoose');

// GET /polls - Get all polls
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    
    const formattedPolls = polls.map(poll => ({
      id: poll._id,
      question: poll.question,
      options: poll.options,
      createdAt: poll.createdAt
    }));
    
    res.json(formattedPolls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch polls' });
  }
});

// POST /polls - Create a new poll
router.post('/', async (req, res) => {
  try {
    const { question, options } = req.body;
    
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ 
        error: 'Question and at least 2 options are required' 
      });
    }

    const formattedOptions = options.map(option => ({
      text: typeof option === 'string' ? option : option.text || option,
      votes: 0
    }));

    const poll = new Poll({
      question,
      options: formattedOptions
    });

    await poll.save();
    
    res.status(201).json({
      id: poll._id,
      question: poll.question,
      options: poll.options,
      createdAt: poll.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create poll' });
  }
});

// POST /polls/:id/vote - Vote on a poll
router.post('/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { optionIndex } = req.body;
    
    if (typeof optionIndex !== 'number' || optionIndex < 0) {
      return res.status(400).json({ error: 'Valid optionIndex is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid poll ID' });
    }

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    if (optionIndex >= poll.options.length) {
      return res.status(400).json({ error: 'Invalid option index' });
    }

    // For demo purposes, generate a random userId for each vote
    const userId = new mongoose.Types.ObjectId();

    try {
      // Create vote record
      const vote = new Vote({
        pollId: id,
        userId: userId,
        optionIndex: optionIndex
      });
      
      await vote.save();

      // Update poll vote count
      poll.options[optionIndex].votes += 1;
      await poll.save();

      res.json({
        message: 'Vote recorded successfully',
        poll: {
          id: poll._id,
          question: poll.question,
          options: poll.options
        }
      });
    } catch (voteError) {
      if (voteError.code === 11000) {
        return res.status(400).json({ error: 'You have already voted on this poll' });
      }
      throw voteError;
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// GET /polls/:id - Get a specific poll
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid poll ID' });
    }

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    res.json({
      id: poll._id,
      question: poll.question,
      options: poll.options,
      createdAt: poll.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
});

module.exports = router; 