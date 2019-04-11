import React from 'react';

const EventListItem = ({
  _id,
  title,
  price,
  date,
  creator,
  authUserId,
  onViewDetail
}) => (
  <li key={_id}>
    <div>
      <h1>{title}</h1>
      <h2>{price}</h2>
      <h2>{new Date(date).toLocaleDateString()}</h2>
    </div>
    <div>
      {authUserId === creator._id ? (
        <p>You are the owner of this event</p>
      ) : (
        <button onClick={() => onViewDetail(_id)}>View Details</button>
      )}
    </div>
  </li>
);

export default EventListItem;
