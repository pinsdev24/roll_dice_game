document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.getElementById('rollButton');
    const guestButton = document.getElementById('guestButton');
    const userButton = document.getElementById('userButton');
    const dice = [document.getElementById('dice0'), document.getElementById('dice1')];
    const result = document.getElementById('result');
    const modalDialog = document.getElementById('modal-dialog');

    const playerScore = document.getElementById('playerScore')
    const gamesPlayed = document.getElementById('gamesPlayed')

    if (rollButton) {
        rollButton.addEventListener('click', () => {
            rollButton.disabled = true;
            let rolls = [];

            dice.forEach((die, index) => {
                die.classList.add('animate-spin-slow');
                setTimeout(() => {
                    const roll = Math.floor(Math.random() * 6) + 1;
                    rolls.push(roll);
                    die.src = `/images/dice-${roll}.png`;
                    die.classList.remove('animate-spin-slow');

                    if (index === dice.length - 1) {
                        const total = rolls.reduce((sum, num) => sum + num, 0);
                        result.textContent = `Vous avez obtenu un total de ${total}!`;
                        playerScore.textContent = +playerScore.textContent + total
                        gamesPlayed.textContent = +gamesPlayed.textContent + 1
                        saveGame({score: total})
                        rollButton.disabled = false;
                    }
                }, 1000 * (index + 1));
            });
        });
    }

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

    async function saveGame(data) {
        try {
            const url = 'http://localhost:4000/api/save-game';
            
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log(response);
    
            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                window.location.replace('/');
            } else {
                console.error('Error:', response.status, response.statusText);
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