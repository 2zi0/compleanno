let charts = {
    leapYearsChart: null
};

let birthDateTime = null;
let updateInterval = null;

const zodiacIcons = {
    western: {
        'Ariete': '♈',
        'Toro': '♉',
        'Gemelli': '♊',
        'Cancro': '♋',
        'Leone': '♌',
        'Vergine': '♍',
        'Bilancia': '♎',
        'Scorpione': '♏',
        'Sagittario': '♐',
        'Capricorno': '♑',
        'Acquario': '♒',
        'Pesci': '♓'
    },
    chinese: {
        'Topo': '🐀',
        'Bue': '🐂',
        'Tigre': '🐅',
        'Coniglio': '🐇',
        'Drago': '🐉',
        'Serpente': '🐍',
        'Cavallo': '🐎',
        'Capra': '🐐',
        'Scimmia': '🐒',
        'Gallo': '🐓',
        'Cane': '🐕',
        'Maiale': '🐖'
    }
};

// Funzione per ottenere i colori in base al genere
function getGenderColors() {
    const gender = document.body.getAttribute('data-gender');
    if (gender === 'female') {
        return {
            primary: '#e91e63',
            secondary: '#fce4ec'
        };
    }
    // Default e male
    return {
        primary: '#2196f3',
        secondary: '#bbdefb'
    };
}

function initializeLeapYearsChart(data) {
    const ctx = document.getElementById('leapYearsChart').getContext('2d');
    const colors = getGenderColors();
    
    // Distruggi il grafico esistente se presente
    if (charts.leapYearsChart) {
        charts.leapYearsChart.destroy();
    }

    charts.leapYearsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Anni Bisestili', 'Anni Normali'],
            datasets: [{
                data: [data.leapYears, Math.floor(data.years) - data.leapYears],
                backgroundColor: [colors.primary, colors.secondary]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function updateLiveCounters() {
    if (!birthDateTime) return;
    
    const now = new Date();
    const diffInMilliseconds = now - birthDateTime;
    
    // Calcola secondi e minuti
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    
    const secondsElement = document.getElementById('seconds');
    const minutesElement = document.getElementById('minutes');
    
    if (secondsElement) {
        secondsElement.textContent = formatNumber(diffInSeconds);
    }
    if (minutesElement) {
        minutesElement.textContent = formatNumber(diffInMinutes);
    }
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function updateProgressBars(data) {
    const colors = getGenderColors();
    const updateProgress = (value, total, elementId) => {
        const percentage = Math.min((value / total) * 100, 100);
        const element = document.getElementById(elementId);
        if (element) {
            element.style.width = `${percentage}%`;
            element.style.backgroundColor = colors.primary;
            element.title = `${value} su ${total} totali (${percentage.toFixed(1)}%)`;
        }
    };

    updateProgress(data.lunarCycles, data.lunarCyclesTotal, 'lunarProgress');
    updateProgress(data.seasons, data.seasonsTotal, 'seasonsProgress');
    updateProgress(data.solarEclipses, data.solarEclipsesTotal, 'solarProgress');
    updateProgress(data.lunarEclipses, data.lunarEclipsesTotal, 'lunarEclipsesProgress');
    updateProgress(data.solstices, data.solsticesTotal, 'solsticesProgress');
    updateProgress(data.equinoxes, data.equinoxesTotal, 'equinoxesProgress');
}

function createFireworks() {
    const container = document.createElement('div');
    container.className = 'fireworks-container';
    document.body.appendChild(container);

    const gender = document.body.getAttribute('data-gender');
    const colors = gender === 'female' 
        ? ['#e91e63', '#ec407a', '#ad1457'] // Rosa
        : ['#2196f3', '#64b5f6', '#1976d2']; // Blu

    const fireworks = new Fireworks.default(container, {
        autoresize: true,
        opacity: 0.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 50,
        traceLength: 3,
        traceSpeed: 10,
        explosion: 5,
        intensity: 30,
        flickering: 50,
        lineStyle: 'round',
        hue: {
            min: 0,
            max: 360
        },
        delay: {
            min: 30,
            max: 60
        },
        rocketsPoint: {
            min: 50,
            max: 50
        },
        lineWidth: {
            explosion: {
                min: 1,
                max: 3
            },
            trace: {
                min: 1,
                max: 2
            }
        },
        brightness: {
            min: 50,
            max: 80
        },
        decay: {
            min: 0.015,
            max: 0.03
        },
        mouse: {
            click: false,
            move: false,
            max: 1
        }
    });

    fireworks.start();

    // Ferma i fuochi d'artificio dopo 6 secondi e rimuovi il container dopo il fade out
    setTimeout(() => {
        fireworks.stop();
        setTimeout(() => {
            container.remove();
        }, 1500);
    }, 6000);
}

function calculateMetrics() {
    const birthdate = document.getElementById('birthdate').value;
    const gender = document.getElementById('gender').value;
    
    if (!birthdate) {
        alert('Per favore inserisci una data di nascita');
        return;
    }

    // Applica il genere al body
    document.body.setAttribute('data-gender', gender.toLowerCase());

    // Imposta la data di nascita per l'aggiornamento in tempo reale
    birthDateTime = new Date(birthdate);

    fetch('http://localhost:8000/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            birthDate: birthdate,
            gender: gender 
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Errore nella risposta del server');
            });
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('results').classList.remove('hidden');
        
        // Aggiorna l'età formattata
        document.getElementById('formatted-age').textContent = data.age;
        
        // Aggiorna i valori nelle card
        document.getElementById('years').textContent = data.years;
        document.getElementById('months').textContent = data.months;
        document.getElementById('days').textContent = formatNumber(data.days);
        document.getElementById('hours').textContent = formatNumber(data.hours);
        document.getElementById('leapYears').textContent = data.leapYears;
        document.getElementById('lunarCycles').textContent = data.lunarCycles;
        document.getElementById('seasons').textContent = data.seasons;
        
        // Aggiorna i dettagli delle eclissi solari
        document.getElementById('solarEclipsesTotal').textContent = data.solarEclipses.total;
        document.getElementById('solarEclipsesPartial').textContent = data.solarEclipses.partial;
        document.getElementById('solarEclipsesAnnular').textContent = data.solarEclipses.annular;
        document.getElementById('solarEclipsesAll').textContent = data.solarEclipses.total_all;
        
        // Aggiorna i dettagli delle eclissi lunari
        document.getElementById('lunarEclipsesTotal').textContent = data.lunarEclipses.total;
        document.getElementById('lunarEclipsesPartial').textContent = data.lunarEclipses.partial;
        document.getElementById('lunarEclipsesPenumbral').textContent = data.lunarEclipses.penumbral;
        document.getElementById('lunarEclipsesAll').textContent = data.lunarEclipses.total_all;
        
        // Aggiorna gli eventi stagionali
        document.getElementById('solsticesCount').textContent = data.seasonalEvents.solstices;
        document.getElementById('equinoxesCount').textContent = data.seasonalEvents.equinoxes;
        document.getElementById('seasonalEventsTotal').textContent = data.seasonalEvents.total;
        
        // Aggiorna le altre vite
        document.getElementById('moonAge').textContent = data.otherLives.moon;
        document.getElementById('marsAge').textContent = data.otherLives.mars;
        document.getElementById('dogAge').textContent = data.otherLives.dog;
        document.getElementById('catAge').textContent = data.otherLives.cat;
        
        // Aggiorna i segni zodiacali
        document.getElementById('western-zodiac-name').textContent = data.westernZodiac;
        document.getElementById('chinese-zodiac-name').textContent = data.chineseZodiac;
        document.getElementById('western-zodiac-icon').textContent = zodiacIcons.western[data.westernZodiac];
        document.getElementById('chinese-zodiac-icon').textContent = zodiacIcons.chinese[data.chineseZodiac];
        
        // Aggiorna la barra del progresso della vita
        document.getElementById('years-lived').textContent = `${Math.floor(data.years)} anni`;
        document.getElementById('life-progress').style.width = `${data.lifePercentage}%`;
        
        // Inizializza il grafico degli anni bisestili
        initializeLeapYearsChart(data);
        
        // Aggiorna le barre di progresso
        updateProgressBars(data);
        
        // Avvia i fuochi d'artificio dopo aver mostrato i risultati
        createFireworks();
        
        // Avvia l'aggiornamento in tempo reale
        startLiveUpdate();
    })
    .catch(error => {
        console.error('Errore dettagliato:', error);
        alert('Si è verificato un errore: ' + error.message);
    });
}

function startLiveUpdate() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    updateLiveCounters();
    updateInterval = setInterval(updateLiveCounters, 1000);
}

// Pulisci l'intervallo quando la pagina viene chiusa
window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});
