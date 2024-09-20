// Initialize the coach layout (11 rows of 7 seats and the last row with 3 seats)
const coach = [];
for (let i = 0; i < 11; i++) {
    coach.push(new Array(7).fill('available')); // 7 seats per row
}
coach.push(new Array(3).fill('available')); // Last row with 3 seats

// Display the initial seat layout
function displayCoach() {
    const coachDiv = document.getElementById('coach');
    coachDiv.innerHTML = ''; // Clear previous display

    coach.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        row.forEach((seat, seatIndex) => {
            const seatDiv = document.createElement('div');
            seatDiv.classList.add('seat');
            seatDiv.classList.add(seat); // 'available' or 'booked'
            seatDiv.innerText = `${rowIndex + 1}-${seatIndex + 1}`; // Seat number (Row-Seat)

            rowDiv.appendChild(seatDiv);
        });

        coachDiv.appendChild(rowDiv);
    });
}

// Check if a full row can accommodate the seat booking
function checkAvailabilityInRow(row, seatsNeeded) {
    return row.filter(seat => seat === 'available').length >= seatsNeeded;
}

// Book seats in a specific row
function bookSeatsInRow(row, seatsNeeded) {
    const seatsBooked = [];
    for (let i = 0; i < row.length && seatsBooked.length < seatsNeeded; i++) {
        if (row[i] === 'available') {
            row[i] = 'booked'; // Book the seat
            seatsBooked.push(i); // Store the index of the booked seat
        }
    }
    return seatsBooked;
}

// Book seats in the coach
function bookSeats(seatsNeeded) {
    const seatsBooked = [];

    // Try to find an entire row that can accommodate all the seats
    for (let rowIndex = 0; rowIndex < coach.length; rowIndex++) {
        if (checkAvailabilityInRow(coach[rowIndex], seatsNeeded)) {
            const bookedSeatsInRow = bookSeatsInRow(coach[rowIndex], seatsNeeded);
            bookedSeatsInRow.forEach(seatIndex => {
                seatsBooked.push({ row: rowIndex + 1, seat: seatIndex + 1 });
            });
            return seatsBooked; // Return once seats are booked
        }
    }

    // If no row can fully accommodate, book seats across rows
    for (let rowIndex = 0; rowIndex < coach.length && seatsBooked.length < seatsNeeded; rowIndex++) {
        const availableSeats = coach[rowIndex].filter(seat => seat === 'available').length;
        if (availableSeats > 0) {
            const seatsToBook = Math.min(availableSeats, seatsNeeded - seatsBooked.length);
            const bookedSeatsInRow = bookSeatsInRow(coach[rowIndex], seatsToBook);
            bookedSeatsInRow.forEach(seatIndex => {
                seatsBooked.push({ row: rowIndex + 1, seat: seatIndex + 1 });
            });
        }
    }

    return seatsBooked; // Return booked seats
}

// Handle seat reservation
document.getElementById('reserveButton').addEventListener('click', () => {
    const seatsNeeded = parseInt(document.getElementById('seatsInput').value);
    const messageDiv = document.getElementById('message');
    messageDiv.innerText = ''; // Clear previous message

    if (seatsNeeded < 1 || seatsNeeded > 7) {
        messageDiv.innerText = 'Please enter a value between 1 and 7!';
        return;
    }

    const seatsBooked = bookSeats(seatsNeeded);
    if (seatsBooked.length === 0) {
        messageDiv.innerText = 'Not enough seats available or the coach is full!';
    } else {
        let bookingInfo = 'Seats booked: ';
        seatsBooked.forEach(seat => {
            bookingInfo += `(Row ${seat.row}, Seat ${seat.seat}) `;
        });
        messageDiv.innerText = bookingInfo;
    }

    displayCoach(); // Update the coach display
});

// Initialize the coach layout when the page loads
displayCoach();
