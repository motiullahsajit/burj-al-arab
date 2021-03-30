import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';

const Bookings = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext)
    const [bookings, setBookings] = useState([])
    useEffect(() => {
        fetch(`https://infinite-wave-24551.herokuapp.com/bookings?email=${loggedInUser.email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${sessionStorage.getItem('token')}`,
            }
        })
            .then(res => res.json())
            .then(data => setBookings(data))
    }, [loggedInUser.email])
    return (
        <div>
            <h3>You have: {bookings.length} bookings</h3>
            {
                bookings.map(booking => <li key={booking._id}>{booking.name} from: {(new Date(booking.checkIn).toDateString('dd/mm/yyyy'))} to : {(new Date(booking.checkOut).toDateString('dd/mm/yyyy'))} </li>)
            }
        </div>
    );
};

export default Bookings;