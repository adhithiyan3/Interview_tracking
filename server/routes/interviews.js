const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const auth = require('../middleware/auth');

// @route   GET api/interviews
// @desc    Get all user's interviews
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = { user: req.user.id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort by date ascending (soonest first)
    const interviews = await Interview.find(query).sort({ date: 1 });
    res.json(interviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/interviews
// @desc    Create an interview
// @access  Private
router.post('/', auth, async (req, res) => {
  const { company, role, status, date, type, location, notes, salary, jobDescriptionUrl, shortlistLevel, rejectionReason } = req.body;

  if (!company || !role || !date) {
    return res.status(400).json({ msg: 'Company, role, and date are required' });
  }

  try {
    const newInterview = new Interview({
      user: req.user.id,
      company,
      role,
      status: status || 'Pending',
      date,
      type: type || 'Technical',
      location: location || '',
      notes: notes || '',
      salary: salary || '',
      jobDescriptionUrl: jobDescriptionUrl || '',
      shortlistLevel: shortlistLevel || 'Screening',
      rejectionReason: rejectionReason || ''
    });

    const interview = await newInterview.save();
    res.status(201).json(interview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/interviews/:id
// @desc    Update an interview
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { company, role, status, date, type, location, notes, salary, jobDescriptionUrl, shortlistLevel, rejectionReason } = req.body;

  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ msg: 'Interview not found' });
    }

    // Make sure user owns interview
    if (interview.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Build update object
    const fields = {};
    if (company !== undefined) fields.company = company;
    if (role !== undefined) fields.role = role;
    if (status !== undefined) fields.status = status;
    if (date !== undefined) fields.date = date;
    if (type !== undefined) fields.type = type;
    if (location !== undefined) fields.location = location;
    if (notes !== undefined) fields.notes = notes;
    if (salary !== undefined) fields.salary = salary;
    if (jobDescriptionUrl !== undefined) fields.jobDescriptionUrl = jobDescriptionUrl;
    if (shortlistLevel !== undefined) fields.shortlistLevel = shortlistLevel;
    if (rejectionReason !== undefined) fields.rejectionReason = rejectionReason;

    interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { $set: fields },
      { new: true }
    );

    res.json(interview);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Interview not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/interviews/:id
// @desc    Delete an interview
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ msg: 'Interview not found' });
    }

    // Make sure user owns interview
    if (interview.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Interview.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Interview removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Interview not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
