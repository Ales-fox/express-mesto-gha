const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  correctUser,
  correctAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', correctUser);
router.patch('/me/avatar', correctAvatar);

module.exports = router;
