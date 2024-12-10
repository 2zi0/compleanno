from datetime import datetime, timedelta, timezone
import math

def get_western_zodiac(birth_date):
    day = birth_date.day
    month = birth_date.month
    
    if (month == 3 and day >= 21) or (month == 4 and day <= 19):
        return "Ariete"
    elif (month == 4 and day >= 20) or (month == 5 and day <= 20):
        return "Toro"
    elif (month == 5 and day >= 21) or (month == 6 and day <= 20):
        return "Gemelli"
    elif (month == 6 and day >= 21) or (month == 7 and day <= 22):
        return "Cancro"
    elif (month == 7 and day >= 23) or (month == 8 and day <= 22):
        return "Leone"
    elif (month == 8 and day >= 23) or (month == 9 and day <= 22):
        return "Vergine"
    elif (month == 9 and day >= 23) or (month == 10 and day <= 22):
        return "Bilancia"
    elif (month == 10 and day >= 23) or (month == 11 and day <= 21):
        return "Scorpione"
    elif (month == 11 and day >= 22) or (month == 12 and day <= 21):
        return "Sagittario"
    elif (month == 12 and day >= 22) or (month == 1 and day <= 19):
        return "Capricorno"
    elif (month == 1 and day >= 20) or (month == 2 and day <= 18):
        return "Acquario"
    else:
        return "Pesci"

def get_chinese_zodiac(birth_date):
    zodiac_animals = ["Topo", "Bue", "Tigre", "Coniglio", "Drago", "Serpente",
                     "Cavallo", "Capra", "Scimmia", "Gallo", "Cane", "Maiale"]
    year = birth_date.year
    return zodiac_animals[(year - 1900) % 12]

def count_solstices_and_equinoxes(birth_date, current_date):
    """
    Calcola il numero di solstizi ed equinozi vissuti considerando le date approssimative.
    Solstizi: ~21 giugno e ~21 dicembre
    Equinozi: ~20 marzo e ~22 settembre
    """
    dates_per_year = [
        (3, 20),  # Equinozio di primavera
        (6, 21),  # Solstizio d'estate
        (9, 22),  # Equinozio d'autunno
        (12, 21)  # Solstizio d'inverno
    ]
    
    solstices = 0
    equinoxes = 0
    
    for year in range(birth_date.year, current_date.year + 1):
        for month, day in dates_per_year:
            event_date = datetime(year, month, day, tzinfo=timezone.utc)
            if birth_date <= event_date <= current_date:
                if month in [6, 12]:  # Solstizi
                    solstices += 1
                else:  # Equinozi
                    equinoxes += 1
    
    return solstices, equinoxes

def calculate_age_and_months(birth_date, current_date):
    """
    Calcola l'età precisa in anni, mesi e giorni
    """
    years = current_date.year - birth_date.year
    months = current_date.month - birth_date.month
    days = current_date.day - birth_date.day

    # Aggiusta i mesi e gli anni se necessario
    if days < 0:
        months -= 1
        # Calcola i giorni dal mese precedente
        last_month = current_date.replace(day=1) - timedelta(days=1)
        days += last_month.day
    
    if months < 0:
        years -= 1
        months += 12

    return years, months, days

def calculate_eclipses(years):
    """
    Calcola il numero approssimativo di ogni tipo di eclissi
    Medie annuali:
    - Solare totale: 0.4
    - Solare parziale: 1.6
    - Solare anulare: 0.4
    - Lunare totale: 0.3
    - Lunare parziale: 0.8
    - Lunare penombrale: 1.2
    """
    return {
        'solar': {
            'total': int(years * 0.4),  # Media di 0.4 all'anno
            'partial': int(years * 1.6), # Media di 1.6 all'anno
            'annular': int(years * 0.4), # Media di 0.4 all'anno
            'total_all': int(years * 2.4) # Totale di tutte le eclissi solari
        },
        'lunar': {
            'total': int(years * 0.3),    # Media di 0.3 all'anno
            'partial': int(years * 0.8),   # Media di 0.8 all'anno
            'penumbral': int(years * 1.2), # Media di 1.2 all'anno
            'total_all': int(years * 2.3)  # Totale di tutte le eclissi lunari
        }
    }

def calculate_solstices_and_equinoxes(years):
    """
    Calcola il numero di solstizi ed equinozi basandosi sugli anni vissuti
    Ci sono 2 solstizi (estate e inverno) e 2 equinozi (primavera e autunno) ogni anno
    """
    total_events = int(years * 4)  # 4 eventi all'anno
    solstices = int(years * 2)     # 2 solstizi all'anno
    equinoxes = int(years * 2)     # 2 equinozi all'anno
    
    return {
        'total': total_events,
        'solstices': solstices,
        'equinoxes': equinoxes
    }

def calculate_other_lives(earth_years):
    """
    Calcola l'età equivalente in altri contesti:
    - Luna: un anno = 27.32 giorni terrestri
    - Marte: un anno = 687 giorni terrestri
    - Cane: proporzione basata sulla vita media (13 anni)
    - Gatto: proporzione basata sulla vita media (15 anni)
    
    Formula per animali:
    anni_umani : 100 = x : vita_media_animale
    quindi: x = (anni_umani * vita_media_animale) / 100
    """
    earth_days = earth_years * 365.25
    
    # Vita media degli animali in anni
    DOG_LIFESPAN = 13
    CAT_LIFESPAN = 15
    
    return {
        'moon': round(earth_days / 27.32, 1),  # Età sulla Luna (periodo orbitale lunare)
        'mars': round(earth_days / 687, 1),    # Età su Marte (periodo orbitale marziano)
        'dog': round((earth_years * DOG_LIFESPAN) / 100, 1),  # Età proporzionale del cane
        'cat': round((earth_years * CAT_LIFESPAN) / 100, 1)   # Età proporzionale del gatto
    }

def calculate_metrics(birth_date, gender):
    print(f"Calcolo delle metriche per: {birth_date}, Genere: {gender}")
    now = datetime.now(timezone.utc)
    delta = now - birth_date
    
    # Calcoli base
    total_seconds = int(delta.total_seconds())
    total_minutes = int(total_seconds / 60)
    total_hours = int(total_minutes / 60)
    total_days = delta.days
    
    # Calcolo anni e mesi più preciso
    years, months, days = calculate_age_and_months(birth_date, now)
    total_months = years * 12 + months
    
    # Calcolo altre vite
    other_lives = calculate_other_lives(years)
    
    # Calcolo segni zodiacali
    western_zodiac = get_western_zodiac(birth_date)
    chinese_zodiac = get_chinese_zodiac(birth_date)
    
    # Anni bisestili
    leap_years = sum(1 for y in range(birth_date.year, now.year + 1) 
                    if ((y % 4 == 0 and y % 100 != 0) or (y % 400 == 0)))
    
    # Cicli lunari (un ciclo ogni 29.53 giorni)
    lunar_cycles = int(total_days / 29.53)  # Arrotonda per difetto
    lunar_cycles_total = int((100 * 365.25) / 29.53)  # Cicli lunari in 100 anni
    
    # Stagioni (4 per anno)
    seasons = int(years * 4)  # Arrotonda per difetto
    seasons_total = 400  # 100 anni * 4 stagioni
    
    # Calcolo dettagliato delle eclissi
    eclipses = calculate_eclipses(years)
    
    # Calcolo solstizi ed equinozi
    seasonal_events = calculate_solstices_and_equinoxes(years)
    
    # Aspettativa di vita (fissa a 100 anni)
    life_expectancy = 100
    years_remaining = life_expectancy - years
    life_percentage = (years / life_expectancy) * 100
    
    return {
        'seconds': total_seconds,
        'minutes': total_minutes,
        'hours': total_hours,
        'days': total_days,
        'months': total_months,
        'years': years,
        'leapYears': leap_years,
        'lunarCycles': lunar_cycles,
        'lunarCyclesTotal': lunar_cycles_total,
        'seasons': seasons,
        'seasonsTotal': seasons_total,
        'solarEclipses': eclipses['solar'],
        'lunarEclipses': eclipses['lunar'],
        'seasonalEvents': seasonal_events,
        'otherLives': other_lives,
        'lifeExpectancy': life_expectancy,
        'yearsRemaining': years_remaining,
        'lifePercentage': round(life_percentage, 1),
        'age': f"{years} anni, {months} mesi e {days} giorni",
        'westernZodiac': western_zodiac,
        'chineseZodiac': chinese_zodiac
    }
