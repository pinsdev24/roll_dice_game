document.addEventListener('DOMContentLoaded', () => {
    const guestButton = document.getElementById('guestButton');
    const userButton = document.getElementById('userButton');
    const modalDialog = document.getElementById('modal-dialog');

    async function guestUser() {
        try {
            const url = 'http://localhost:4000/api/guest';
            
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                const result = await response.json();
                window.location.replace('/');
                console.log('Success:', result);
            } else {
                console.error('Error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }

    async function createUserWithName() {
        try {
            const url = 'http://localhost:4000/api/register';
            const nameInput = document.getElementById('username').value
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: nameInput})
            });

            console.log('Response:', response);
            if (response.ok) {
                const result = await response.json();
                window.location.replace('/');
            } else {
                if (response.status == 409){
                    modalDialog.classList.remove("hidden");
                }else {
                    console.error('Error:', response.status, response.statusText);
                }
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }

    guestButton.addEventListener('click', async(e) => {
        e.preventDefault();
        await guestUser();
    });

    userButton.addEventListener('click', async(e) => {
        e.preventDefault();
        await createUserWithName();
    });


});