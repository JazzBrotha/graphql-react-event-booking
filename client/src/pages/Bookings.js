import React, { Component } from 'react';
import AuthContext from '../context/AuthContext';
import BookingList from '../components/Booking/BookingList';

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: []
  };

  static contextType = AuthContext;

  componentDidMount() {
    const { fetchBookings } = this;
    fetchBookings();
  }

  fetchBookings = async () => {
    this.setState({
      isLoading: true
    });
    const requestBody = {
      query: `
          query {
            bookings {
              _id
              createdAt
              event {
                _id
                title
                date
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
        data: { bookings }
      } = parsedResponse;
      this.setState({
        bookings,
        isLoading: false
      });
    } catch (err) {
      console.log(err);
      this.setState({
        isLoading: false
      });
    }
  };

  deleteBookingHandler = async bookingId => {
    this.setState({
      isLoading: true
    });
    const requestBody = {
      query: `
          mutation {
            cancelBooking(bookingId: "${bookingId}") {
              _id
              title
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
      this.setState(({ bookings }) => {
        const updatedBookings = bookings.filter(
          booking => booking._id !== bookingId
        );
        return {
          bookings: updatedBookings,
          isLoading: false
        };
      });
    } catch (err) {
      console.log(err);
      this.setState({
        isLoading: false
      });
    }
  };

  render() {
    const { deleteBookingHandler } = this;
    const { bookings, isLoading } = this.state;
    return (
      <>
        <h1>The Bookings page</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
        )}
      </>
    );
  }
}

export default BookingsPage;
