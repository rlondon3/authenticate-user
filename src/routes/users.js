const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, handleErrors } = require('../models/user');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {
    const result = handleErrors(req.body);

    if (result.error) return res.status(400).send(result.error.details[0].message);

    let user = await User.findOne({
        email: req.body.email
    });
    if (user) return res.status(400).send('User already registered!');

    user = new User(_.pick(req.body, ['first_name', 'last_name', 'DOB', 'city', 'state', 'email', 'password', 'subscription_active']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    const pickUser = _.pick(user, ['_id', 'first_name', 'last_name', 'DOB', 'city', 'state', 'email', 'password', 'subscription_active']);

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(pickUser);
    
});

router.put('/:id', auth, async (req, res) => {
    const result = handleErrors(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id,
    { 
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      DOB: req.body.DOB,
      city: req.body.city,
      state: req.body.state,
      email: req.body.email,
      password: req.body.password
    }, { new: true });
    
    if (!user) {
        return res.status(404).send('Movie Not Found!');
    }
   
    res.send(user);
});

router.delete('/:id', auth, async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id)

    if (!user) {
        return res.status(404).send('User Not Found!');
    }

    res.send(user);
})

module.exports = router