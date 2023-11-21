import User from '../models/user.js';
import PendingFriendRequest from '../models/pendingFriendRequest.js';
import { Sequelize } from 'sequelize';


const searchFriend = (req, res, next) => {
    const searchValue = req.body.search;
    const currentUser = req.body.currentUser;
    console.log('Search Value:', searchValue);
    console.log('Current User:', currentUser);

    const whereClause = {};

    if (searchValue) {
        whereClause.userName = {
            [Sequelize.Op.like]: `%${searchValue}%`
        };
    }

    whereClause.user_id = {
        [Sequelize.Op.not]: currentUser
    };

    User.findAll({
        where: whereClause
    })
    .then(dbUsers => {
        if (dbUsers.length === 0) {
            return res.status(404).json({ message: "Geen gebruikers gevonden" });
        } else {
            const searchUserInfo = dbUsers.map(dbUser => ({
                user_id: dbUser.user_id,
                email: dbUser.email,
                userName: dbUser.userName,
                fullName: dbUser.fullName,
                city: dbUser.city,
            }));

            res.status(200).json(searchUserInfo);
        }
    })
    .catch(err => {
        console.log('Error:', err);
        res.status(500).json({ message: "Interne serverfout", error: err.message });
    });
};

const sendFriendRequest = async (req, res, next) => {
    const { currentUser, selectedUserId } = req.body;

    const existingRequest1 = await PendingFriendRequest.findOne({
        where: {
            requesterUserId: currentUser,
            receiverUserId: selectedUserId,
        }
    });

    const existingRequest2 = await PendingFriendRequest.findOne({
        where: {
            requesterUserId: selectedUserId,
            receiverUserId: currentUser,
        }
    });

    if (existingRequest1 || existingRequest2) {
        return res.status(400).json({ message: 'Er bestaat al een vriendenverzoek tussen deze gebruikers' });
    }

    PendingFriendRequest.create({
      requesterUserId: currentUser,
      receiverUserId: selectedUserId,
    })
      .then(() => {
        res.status(200).json({ message: 'Vriendenverzoek succesvol verstuurd' });
      })
      .catch(err => {
        console.log('Error:', err);
        res.status(500).json({ message: 'Interne serverfout' });
      });
};

export { searchFriend, sendFriendRequest };
