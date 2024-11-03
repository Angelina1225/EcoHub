import User from '../models/User.js';

const getUsers = async (req, res) => {
    const users = await User.find();
    return res.render('home', { users });
};

export { getUsers };