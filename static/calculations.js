document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/static/login.html';
        return;
    }

    const calcForm = document.getElementById('calcForm');
    const calcList = document.getElementById('calcList');
    const messageDiv = document.getElementById('message');
    const calcIdInput = document.getElementById('calcId');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const opSymbols = {
        add: '+',
        subtract: '-',
        multiply: '*',
        divide: '/',
        exponentiate: '^'
    };
    
    const handleApiError = async (response) => {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'An unknown error occurred.');
    };

    const fetchCalculations = async () => {
        try {
            const response = await fetch('/calculations/', { headers });
            if (!response.ok) await handleApiError(response);
            
            const calculations = await response.json();
            calcList.innerHTML = ''; 
            calculations.forEach(calc => {
                const li = document.createElement('li');
                const symbol = opSymbols[calc.type] || calc.type; 
                li.innerHTML = `
                    <span>${calc.a} ${symbol} ${calc.b} = ${calc.result.toFixed(2)}</span>
                    <div>
                        <button class="edit-btn" data-id="${calc.id}">Edit</button>
                        <button class="delete-btn" data-id="${calc.id}">Delete</button>
                    </div>
                `;
                calcList.appendChild(li);
            });
        } catch (error) {
            messageDiv.textContent = `Error: ${error.message}`;
            messageDiv.style.color = 'red';
        }
    };

    calcForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const a = parseFloat(document.getElementById('valA').value);
        const b = parseFloat(document.getElementById('valB').value);
        const type = document.getElementById('opType').value;
        const id = calcIdInput.value;

        if (isNaN(a) || isNaN(b)) {
            messageDiv.textContent = 'Please enter valid numbers.';
            messageDiv.style.color = 'red';
            return;
        }

        const url = id ? `/calculations/${id}` : '/calculations/';
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify({ a, b, type })
            });
            if (!response.ok) await handleApiError(response);
            
            resetForm();
            await fetchCalculations();
        } catch (error) {
            messageDiv.textContent = `Error: ${error.message}`;
            messageDiv.style.color = 'red';
        }
    });

    calcList.addEventListener('click', async (e) => {
        const target = e.target;
        const id = target.dataset.id;

        if (target.classList.contains('delete-btn')) {
            if (!confirm('Are you sure you want to delete this calculation?')) return;
            try {
                const response = await fetch(`/calculations/${id}`, { method: 'DELETE', headers });
                if (!response.ok) await handleApiError(response);
                await fetchCalculations(); 
            } catch (error) {
                messageDiv.textContent = error.message;
            }
        }

        if (target.classList.contains('edit-btn')) {
            try {
                const response = await fetch(`/calculations/${id}`, { headers });
                if (!response.ok) await handleApiError(response);
                const calc = await response.json();
                
                document.getElementById('calcId').value = calc.id;
                document.getElementById('valA').value = calc.a;
                document.getElementById('valB').value = calc.b;
                document.getElementById('opType').value = calc.type;
                cancelEditBtn.style.display = 'inline-block';
            } catch (error) {
                messageDiv.textContent = error.message;
            }
        }
    });

    cancelEditBtn.addEventListener('click', resetForm);

    function resetForm() {
        calcForm.reset();
        calcIdInput.value = '';
        cancelEditBtn.style.display = 'none';
        messageDiv.textContent = '';
    }

    fetchCalculations();
});