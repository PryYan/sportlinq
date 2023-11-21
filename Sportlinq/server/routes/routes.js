import express from 'express';

import { signup, login, isAuth, getUserInfo } from '../controllers/auth.js';
import { updateProfile, getUpdatedUserInfo, passwordCheck } from '../controllers/accountdetail.js';
import { getAllLocations } from '../controllers/locationsController.js';
import { searchFriend, sendFriendRequest } from '../controllers/vriendenController.js';
import { getFriends, sendSessionRequest } from '../controllers/newSessionController.js';
import { getSessions } from '../controllers/sessionsController.js';

const router = express.Router();

// voor authenticatie
router.post('/login', login);
router.post('/signup', signup);
router.get('/private', isAuth);
router.post('/getUserInfo', getUserInfo);

// voor locaties
router.get('/locations', getAllLocations);

// voor profile updates
router.patch('/updateProfile', updateProfile);
router.post('/getUpdatedUserInfo', getUpdatedUserInfo);
router.post('/passwordCheck', passwordCheck);

// voor vrienden
router.post('/searchFriend', searchFriend);
router.post('/sendFriendRequest', sendFriendRequest);

// voor nieuwe sessie
router.get('/getFriends', getFriends);
router.post('/sendSessionRequest', sendSessionRequest);

// voor sessions
router.get('/sessions', getSessions);


export default router;