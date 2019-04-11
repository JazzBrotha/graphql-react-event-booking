import React, { Component } from 'react';
import Modal from '../components/Modal/Modal';
import AuthContext from '../context/AuthContext';
import EventList from '../components/Event/EventList';

class EventsPage extends Component {
  state = {
    isModalOpen: false,
    title: '',
    price: '',
    date: '',
    description: '',
    events: [],
    isLoading: false,
    selectedEvent: null
  };

  static contextType = AuthContext;

  componentDidMount() {
    const { fetchEvents } = this;
    fetchEvents();
  }

  openModal = () => {
    this.setState({
      isModalOpen: true
    });
  };

  handleConfirmEvent = () => {
    const { createEvent } = this;
    this.setState({
      isModalOpen: false
    });
    createEvent();
  };

  handleCancelEvent = () => {
    this.setState({
      isModalOpen: false,
      selectedEvent: null
    });
  };

  onChangeHandler = e => {
    const inputField = e.target;
    this.setState({
      [inputField.id]: inputField.value
    });
  };

  bookEventHandler = () => {};

  createEvent = async e => {
    const { title, description, price, date } = this.state;
    const requestBody = {
      query: `
          mutation {
            createEvent(event: {title: "${title}", description: "${description}", price: ${+price}, date: "${date}"}) {
              _id
              title
              description
              price
              date
              creator {
                _id
                email
              }
            }
          }
          `
    };
    try {
      const { token } = this.context;
      const response = await fetch('http://localhost:8000/api', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Request failed');
      }
      const parsedResponse = await response.json();
      const {
        data: { createEvent }
      } = parsedResponse;
      this.setState(({ events }) => {
        return { events: [...events, createEvent] };
      });
    } catch (err) {
      console.log(err);
    }
  };

  fetchEvents = async () => {
    this.setState({
      isLoading: true
    });
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              price
              date
              creator {
                _id
                email
              }
            }
          }
          `
    };
    try {
      const response = await fetch('http://localhost:8000/api', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Request failed');
      }
      const parsedResponse = await response.json();
      const {
        data: { events }
      } = parsedResponse;
      this.setState({
        events,
        isLoading: false
      });
    } catch (err) {
      console.log(err);
      this.setState({
        isLoading: false
      });
    }
  };

  showDetailHandler = eventId => {
    this.setState(({ events }) => {
      const selectedEvent = events.find(event => event._id === eventId);
      return { selectedEvent };
    });
  };

  render() {
    const {
      openModal,
      handleCancelEvent,
      handleConfirmEvent,
      onChangeHandler,
      showDetailHandler,
      bookEventHandler
    } = this;
    const { isModalOpen, events, isLoading, selectedEvent } = this.state;
    const { token, userId } = this.context;
    return (
      <>
        {isModalOpen && (
          <Modal
            title="Modal Title"
            canConfirm
            canCancel
            onCancel={handleCancelEvent}
            onConfirm={bookEventHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input onChange={onChangeHandler} type="text" id="title" />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input onChange={onChangeHandler} type="number" id="price" />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input onChange={onChangeHandler} type="date" id="date" />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  rows="4"
                  onChange={onChangeHandler}
                  type="text"
                  id="description"
                />
              </div>
            </form>
          </Modal>
        )}
        {selectedEvent && (
          <Modal
            title={selectedEvent.title}
            canConfirm
            canCancel
            onCancel={handleCancelEvent}
            onConfirm={handleConfirmEvent}
            confirmText="Book"
          >
            <div>
              <h1>{selectedEvent.title}</h1>
              <h2>{selectedEvent.price}</h2>
              <h2>{new Date(selectedEvent.date).toLocaleDateString()}</h2>
              <p>{selectedEvent.description}</p>
            </div>
          </Modal>
        )}

        {token && (
          <div className="events-control">
            <p>Share your own events! </p>
            <button onClick={openModal}>Create Event</button>
          </div>
        )}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <EventList
            events={events}
            authUserId={userId}
            onViewDetail={showDetailHandler}
          />
        )}
      </>
    );
  }
}

export default EventsPage;
