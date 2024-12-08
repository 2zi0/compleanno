from datetime import datetime, timedelta
import ephem
import math

def calculate_metrics(birth_date, gender):
    now = datetime.now()
    delta = now - birth_date
    
    # Calcoli base
    total_seconds = int(delta.total_seconds())
    total_minutes = int(total_seconds / 60)
    total_hours = int(total_minutes / 60)
    total_days = delta.days
    
    # Calcolo anni e mesi più preciso
    years = total_days / 365.25
    months = int(years * 12)
    
    # Anni bisestili
    leap_years = sum(1 for y in range(birth_date.year, now.year + 1) 
                    if ((y % 4 == 0 and y % 100 != 0) or (y % 400 == 0)))
    
    # Cicli lunari (un ciclo ogni 29.53 giorni)
    lunar_cycles = int(total_days / 29.53)  # Arrotonda per difetto
    lunar_cycles_total = int((100 * 365.25) / 29.53)  # Cicli lunari in 100 anni
    
    # Stagioni (4 per anno)
    seasons = int(years * 4)  # Arrotonda per difetto
    seasons_total = 400  # 100 anni * 4 stagioni
    
    # Eclissi solari (media di 2.38 all'anno)
    solar_eclipses = int(years * 2.38)  # Arrotonda per difetto
    solar_eclipses_total = 238  # 100 anni * 2.38 eclissi/anno
    
    # Eclissi lunari (media di 2.33 all'anno)
    lunar_eclipses = int(years * 2.33)  # Arrotonda per difetto
    lunar_eclipses_total = 233  # 100 anni * 2.33 eclissi/anno
    
    # Solstizi (2 all'anno: estate e inverno)
    solstices = int(years * 2)  # Arrotonda per difetto
    solstices_total = 200  # 100 anni * 2 solstizi/anno
    
    # Equinozi (2 all'anno: primavera e autunno)
    equinoxes = int(years * 2)  # Arrotonda per difetto
    equinoxes_total = 200  # 100 anni * 2 equinozi/anno
    
    # Aspettativa di vita (fissa a 100 anni)
    life_expectancy = 100
    years_remaining = life_expectancy - int(years)
    life_percentage = (years / life_expectancy) * 100
    
    # Calcolo giorni del mese corrente
    days_in_current_month = (total_days % 365) % 30
    
    return {
        'seconds': total_seconds,
        'minutes': total_minutes,
        'hours': total_hours,
        'days': total_days,
        'months': months,
        'years': int(years),
        'leapYears': leap_years,
        'lunarCycles': lunar_cycles,
        'lunarCyclesTotal': lunar_cycles_total,
        'seasons': seasons,
        'seasonsTotal': seasons_total,
        'solarEclipses': solar_eclipses,
        'solarEclipsesTotal': solar_eclipses_total,
        'lunarEclipses': lunar_eclipses,
        'lunarEclipsesTotal': lunar_eclipses_total,
        'solstices': solstices,
        'solsticesTotal': solstices_total,
        'equinoxes': equinoxes,
        'equinoxesTotal': equinoxes_total,
        'lifeExpectancy': life_expectancy,
        'yearsRemaining': years_remaining,
        'lifePercentage': round(life_percentage, 1),
        'age': f"{int(years)} anni, {int(months % 12)} mesi e {days_in_current_month} giorni"
    }
