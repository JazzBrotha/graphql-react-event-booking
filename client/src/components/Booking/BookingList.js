import React from 'react';

const BookingList = ({ bookings, onDelete }) => (
  <ul>
    {bookings.map(booking => (
      <li key={booking._id}>
        <div>
          {booking.event.title} -{' '}
          {new Date(booking.createdAt).toLocaleDateString()}
        </div>
        <div>
          <button onClick={() => onDelete(booking._id)}>Cancel</button>
        </div>
      </li>
    ))}
  </ul>
);

export default BookingList;
