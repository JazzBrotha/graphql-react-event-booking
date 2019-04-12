const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformEvent, transformBooking } = require('./merge');

module.exports = {
  bookings: async (args, { isAuth, userId }) => {
    if (!isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const bookings = await Booking.find({ user: userId });
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async ({ eventId }, { isAuth, userId }) => {
    if (!isAuth) {
      throw new Error('Unauthenticated');
    }
    const event = await Event.findById(eventId);
    const booking = new Booking({
      user: userId,
      event
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async ({ bookingId }, { isAuth }) => {
    if (!isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const booking = await Booking.findById(bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.findByIdAndDelete(bookingId);
      return event;
    } catch (err) {
      throw err;
    }
  }
};
