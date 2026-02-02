document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    const pricing = {
        standard: 15.00,
        vip: 20.00, // Not explicitly used yet but good for expansion
        taxRate: 0.08
    };

    const rows = 8;
    const seatsPerRow = [10, 12, 14, 16, 16, 18, 18, 20]; // Curved layout approximation

    // Simple state
    let selectedSeats = [];
    const occupiedSeats = ['A-5', 'A-6', 'C-10', 'C-11', 'D-4']; // Mock data

    // --- Elements ---
    const gridContainer = document.getElementById('seating-grid');
    const seatsList = document.getElementById('seats-list');
    const subtotalDisplay = document.getElementById('subtotal-display');
    const taxDisplay = document.getElementById('tax-display');
    const totalDisplay = document.getElementById('total-display');
    const checkoutBtns = [document.getElementById('btn-next-step'), document.getElementById('btn-checkout-side')];

    // --- Render Grid ---
    if (gridContainer) {
        renderSeatingChart();
    }

    function renderSeatingChart() {
        gridContainer.innerHTML = '';

        for (let r = 0; r < rows; r++) {
            const rowLabel = String.fromCharCode(65 + r); // A, B, C...
            const rowDiv = document.createElement('div');
            rowDiv.className = 'flex justify-center gap-2 items-center';

            // Row Label Left
            const labelLeft = document.createElement('span');
            labelLeft.className = 'w-4 text-xs font-bold text-slate-400 text-center';
            labelLeft.innerText = rowLabel;
            rowDiv.appendChild(labelLeft);

            // Seats
            const count = seatsPerRow[r];
            for (let s = 1; s <= count; s++) {
                const seatId = `${rowLabel}-${s}`;
                const isOccupied = occupiedSeats.includes(seatId);
                const isWheelchair = (r === rows - 1 && (s === 1 || s === count)); // Last row ends are wheelchair

                const seatBtn = document.createElement('button');
                // Base classes
                seatBtn.className = `w-8 h-8 rounded-t-lg rounded-b-md text-[10px] font-medium transition-all duration-200 transform hover:scale-110 flex items-center justify-center relative group`;

                // State classes
                if (isOccupied) {
                    seatBtn.className += ' bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed cursor-default';
                    seatBtn.disabled = true;
                } else if (isWheelchair) {
                    seatBtn.className += ' bg-blue-100 hover:bg-blue-300 dark:bg-blue-900/50 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-200';
                    seatBtn.innerHTML = '<i class="fas fa-wheelchair"></i>';
                } else {
                    seatBtn.className += ' bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-transparent hover:text-slate-500';
                }

                seatBtn.dataset.id = seatId;
                seatBtn.dataset.price = pricing.standard;

                if (!isOccupied) {
                    seatBtn.addEventListener('click', () => toggleSeat(seatBtn));
                }

                // Tooltip
                const tooltip = document.createElement('span');
                tooltip.className = 'absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap';
                tooltip.innerText = `Row ${rowLabel} Seat ${s} - $${pricing.standard}`;
                seatBtn.appendChild(tooltip);

                rowDiv.appendChild(seatBtn);
            }

            // Row Label Right
            const labelRight = document.createElement('span');
            labelRight.className = 'w-4 text-xs font-bold text-slate-400 text-center';
            labelRight.innerText = rowLabel;
            rowDiv.appendChild(labelRight);

            gridContainer.appendChild(rowDiv);
        }
    }

    // --- Logic ---
    function toggleSeat(btn) {
        const id = btn.dataset.id;
        const price = parseFloat(btn.dataset.price);

        // Check if already selected
        const index = selectedSeats.findIndex(s => s.id === id);

        if (index > -1) {
            // Deselect
            selectedSeats.splice(index, 1);
            btn.classList.remove('bg-secondary', 'text-white', 'shadow-lg', 'shadow-secondary/50', 'hover:bg-secondary');
            btn.classList.add('bg-slate-200', 'dark:bg-slate-700', 'hover:bg-slate-300', 'text-transparent');

            // Restore wheelchair icon/color if needed (simplification: just reset to default for now, standard logic covers most)
            if (btn.innerHTML.includes('wheelchair')) {
                btn.classList.add('bg-blue-100', 'dark:bg-blue-900/50');
                btn.classList.remove('bg-slate-200', 'bg-secondary');
            }

        } else {
            // Select
            // Max 8 seats
            if (selectedSeats.length >= 8) {
                alert("You can only select up to 8 seats.");
                return;
            }

            selectedSeats.push({ id, price });
            btn.classList.remove('bg-slate-200', 'dark:bg-slate-700', 'bg-blue-100', 'dark:bg-blue-900/50', 'text-transparent', 'text-blue-600');
            btn.classList.add('bg-secondary', 'text-white', 'shadow-lg', 'shadow-secondary/50', 'hover:bg-secondary');
        }

        updateSummary();
    }

    function updateSummary() {
        // Clear list
        seatsList.innerHTML = '';

        if (selectedSeats.length === 0) {
            seatsList.innerHTML = '<p class="text-slate-400 text-sm italic text-center py-4">No seats selected</p>';
            checkoutBtns.forEach(btn => {
                btn.disabled = true;
                btn.classList.add('opacity-50', 'cursor-not-allowed');
            });
            updateTotals(0);
            return;
        }

        // Enable buttons
        checkoutBtns.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        });

        // Add items
        selectedSeats.forEach(seat => {
            const item = document.createElement('div');
            item.className = 'flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-700 py-2 last:border-0';
            item.innerHTML = `
                <div>
                    <span class="font-bold text-slate-800 dark:text-slate-200">Seat ${seat.id}</span>
                    <span class="text-xs text-slate-500 block">General Admission</span>
                </div>
                <span class="font-medium">$${seat.price.toFixed(2)}</span>
            `;
            seatsList.appendChild(item);
        });

        // Calculate Totals
        const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
        updateTotals(subtotal);
    }

    function updateTotals(subtotal) {
        const tax = subtotal * pricing.taxRate;
        const total = subtotal + tax;

        subtotalDisplay.innerText = `$${subtotal.toFixed(2)}`;
        taxDisplay.innerText = `$${tax.toFixed(2)}`;
        totalDisplay.innerText = `$${total.toFixed(2)}`;
    }

});
