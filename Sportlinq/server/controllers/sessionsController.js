// voor nu alleen pending ophalen, later ook de geplande ophalen
import PendingSessionRequest from '../models/pendingSessionRequest.js';
import Location from '../models/location.js';
import User from '../models/user.js';
import { Sequelize } from 'sequelize';

const getSessions = async (req, res, next) => {
    try {
        const currentUserId = req.query.user_id;
        const sessions = await PendingSessionRequest.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { requesterUserId: currentUserId },
                    { receiverUserId: currentUserId }
                ]
            },
            include: [
                {
                    model: Location,
                    as: 'locationRelation',
                    attributes: ['locationName']
                },
                {
                    model: User,
                    as: 'requesterUser',
                    attributes: ['userName'],
                    where: {
                        user_id: Sequelize.col('PendingSessionRequests.requesterUserId')
                    }
                },
                {
                    model: User,
                    as: 'receiverUser',
                    attributes: ['userName'],
                    where: {
                        user_id: Sequelize.col('PendingSessionRequests.receiverUserId')
                    }
                }
            ]
        });

        res.status(200).json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Er is een fout opgetreden bij het ophalen van sessions' });
    }
};

export { getSessions };