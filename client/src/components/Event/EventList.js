import React from 'react';
import EventListItem from './EventListItem';

const EventList = ({ events, authUserId, onViewDetail }) => {
  return (
    <ul>
      {events.map(({ _id, title, date, creator }) => (
        <EventListItem
          key={_id}
          _id={_id}
          title={title}
          date={date}
          creator={creator}
          authUserId={authUserId}
          onViewDetail={onViewDetail}
        />
      ))}
    </ul>
  );
};

export default EventList;
