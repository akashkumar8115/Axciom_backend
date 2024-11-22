class GamificationService {
    async processActivity(userId, activity) {
        const pointsMap = {
            BOOK_RETURN_ONTIME: 10,
            BOOK_REVIEW: 5,
            ATTEND_EVENT: 15,
            REFER_FRIEND: 20
        };

        const points = pointsMap[activity] || 0;
        await this.awardPoints(userId, points);
        await this.checkAchievements(userId);
        return await this.getUserStatus(userId);
    }

    async awardPoints(userId, points) {
        await User.findByIdAndUpdate(userId, {
            $inc: { points: points }
        });
    }

    async checkAchievements(userId) {
        const user = await User.findById(userId);
        const achievements = await Achievement.find({
            requiredPoints: { $lte: user.points },
            _id: { $nin: user.achievements }
        });

        if (achievements.length > 0) {
            await User.findByIdAndUpdate(userId, {
                $push: { achievements: { $each: achievements.map(a => a._id) } }
            });
        }
    }
}
