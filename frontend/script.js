let charts = {
    leapYearsChart: null
};

let birthDateTime = null;
let updateInterval = null;

function initializeLeapYearsChart(data) {
    const ctx = document.getElementById('leapYearsChart').getContext('2d');
    
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
                backgroundColor: ['#2196f3', '#bbdefb']
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
    const birth = new Date(birthDateTime);
    const diffInMilliseconds = now - birth;
    
    // Calcola secondi e minuti includendo anche le frazioni di giorno corrente
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
    const updateProgress = (value, total, elementId) => {
        const percentage = Math.min((value / total) * 100, 100);
        const element = document.getElementById(elementId);
        if (element) {
            element.style.width = `${percentage}%`;
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

function calculateMetrics() {
    const birthdate = document.getElementById('birthdate').value;
    const gender = document.getElementById('gender').value;
    
    if (!birthdate || !gender) {
        alert('Per favore, inserisci sia la data di nascita che il sesso');
        return;
    }

    birthDateTime = birthdate;

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
    .then(response => response.json())
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
        document.getElementById('solarEclipses').textContent = data.solarEclipses;
        document.getElementById('lunarEclipses').textContent = data.lunarEclipses;
        document.getElementById('solstices').textContent = data.solstices;
        document.getElementById('equinoxes').textContent = data.equinoxes;
        
        // Aggiorna la barra del progresso della vita
        document.getElementById('years-lived').textContent = `${Math.floor(data.years)} anni`;
        document.getElementById('life-progress').style.width = `${data.lifePercentage}%`;
        
        // Inizializza il grafico degli anni bisestili
        initializeLeapYearsChart(data);
        
        // Aggiorna le barre di progresso
        updateProgressBars(data);
        
        // Avvia l'aggiornamento in tempo reale
        startLiveUpdate();
    })
    .catch(error => {
        console.error('Errore dettagliato:', error);
        alert('Si è verificato un errore durante il calcolo delle metriche');
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
