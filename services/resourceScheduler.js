class ResourceScheduler {
    async scheduleStudyRoom(roomId, userId, timeSlot) {
        const room = await StudyRoom.findById(roomId);
        if (!room.isAvailable(timeSlot)) {
            throw new Error('Room not available for requested time slot');
        }

        const booking = new Booking({
            room: roomId,
            user: userId,
            timeSlot,
            status: 'confirmed'
        });

        await booking.save();
        await this.notifyUser(userId, 'ROOM_BOOKED', { roomId, timeSlot });
        return booking;
    }

    async getAvailableRooms(criteria) {
        const { capacity, equipment, datetime } = criteria;
        return await StudyRoom.find({
            capacity: { $gte: capacity },
            equipment: { $all: equipment },
            bookings: {
                $not: {
                    $elemMatch: {
                        startTime: { $lt: datetime.end },
                        endTime: { $gt: datetime.start }
                    }
                }
            }
        });
    }
}
