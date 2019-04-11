import React, { Component } from 'react';
import AuthContext from '../context/AuthContext';

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

  render() {
    const { bookings, isLoading } = this.state;
    return (
      <>
        <h1>The Bookings page</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {bookings.map(booking => (
              <li key={booking._id}>
                {booking.event.title} -{' '}
                {new Date(booking.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }
}

export default BookingsPage;
