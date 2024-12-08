import { useState } from 'react';
import './App.css';

function App() {
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [stats, setStats] = useState(null);

  const calculateStats = (birthDate) => {
    const now = new Date();
    const birth = new Date(birthDate);
    const diffTime = Math.abs(now - birth);
    
    // Calcoli base
    const seconds = Math.floor(diffTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365.25);
    const months = Math.floor((days % 365.25) / 30.44);
    
    // Calcoli aggiuntivi
    const leapYears = Math.floor(years / 4);
    const lunarCycles = Math.floor(days / 29.53); // Ciclo lunare medio
    const seasons = Math.floor(days / 91.31); // ~365.25/4
    const solarEclipses = Math.floor(years * 2.37); // Media di eclissi solari all'anno
    const lunarEclipses = Math.floor(years * 2.41); // Media di eclissi lunari all'anno
    const solstices = Math.floor(years * 2); // 2 solstizi all'anno
    const equinoxes = Math.floor(years * 2); // 2 equinozi all'anno

    return {
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      leapYears,
      lunarCycles,
      seasons,
      solarEclipses,
      lunarEclipses,
      solstices,
      equinoxes
    };
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setBirthDate(date);
    if (date) {
      setStats(calculateStats(date));
    }
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  return (
    <div className={`App ${gender ? gender : 'initial'}`}>
      <h1 className="title">La Tua Vita in Numeri</h1>
      
      <div className="form-container">
        <div className="input-group">
          <label htmlFor="birthdate">Data di nascita:</label>
          <input
            id="birthdate"
            type="date"
            value={birthDate}
            onChange={handleDateChange}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="gender">Sesso:</label>
          <select
            id="gender"
            value={gender}
            onChange={handleGenderChange}
          >
            <option value="">Seleziona...</option>
            <option value="male">Maschio</option>
            <option value="female">Femmina</option>
          </select>
        </div>
      </div>

      {stats && (
        <>
          <h2 className="age-title">
            {stats.years} anni, {stats.months} mesi e {Math.floor(stats.days % 30.44)} giorni
          </h2>

          <div className="stats-grid">
            <div className="card">
              <div className="icon">⏱️</div>
              <div className="number">{stats.seconds.toLocaleString()}</div>
              <div className="label">Secondi Vissuti</div>
            </div>

            <div className="card">
              <div className="icon">⌚</div>
              <div className="number">{stats.minutes.toLocaleString()}</div>
              <div className="label">Minuti Vissuti</div>
            </div>

            <div className="card time-lived">
              <div className="icon">📅</div>
              <div className="number">{stats.years}</div>
              <div className="label">anni</div>
              <div className="number">{stats.months}</div>
              <div className="label">mesi</div>
              <div className="number">{stats.days}</div>
              <div className="label">giorni</div>
              <div className="number">{stats.hours.toLocaleString()}</div>
              <div className="label">ore</div>
            </div>

            <div className="card">
              <div className="icon">🔄</div>
              <div className="number">{stats.leapYears}</div>
              <div className="label">Anni Bisestili</div>
            </div>

            <div className="card">
              <div className="icon">🌙</div>
              <div className="number">{stats.lunarCycles}</div>
              <div className="label">Cicli Lunari</div>
            </div>

            <div className="card">
              <div className="icon">🌞</div>
              <div className="number">{stats.seasons}</div>
              <div className="label">Stagioni</div>
            </div>

            <div className="card">
              <div className="icon">☀️</div>
              <div className="number">{stats.solarEclipses}</div>
              <div className="label">Eclissi Solari</div>
            </div>

            <div className="card">
              <div className="icon">🌑</div>
              <div className="number">{stats.lunarEclipses}</div>
              <div className="label">Eclissi Lunari</div>
            </div>

            <div className="card">
              <div className="icon">🌅</div>
              <div className="number">{stats.solstices}</div>
              <div className="label">Solstizi</div>
            </div>

            <div className="card">
              <div className="icon">🌄</div>
              <div className="number">{stats.equinoxes}</div>
              <div className="label">Equinozi</div>
            </div>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${(stats.years / 100) * 100}%`}}
              ></div>
            </div>
            <div className="progress-labels">
              <span>0</span>
              <span>100 anni</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App; 