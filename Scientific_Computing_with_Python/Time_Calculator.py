def add_time(start, duration, day_of_week=None):
    # seperate input in order to use in calculations
    time, period = start.split()
    start_hour, start_minute = map(int, time.split(':'))
    duration_hour, duration_minute = map(int, duration.split(':'))

    # convert to 24 hour time for easier calculations
    if period == "PM":
        start_hour += 12 if start_hour != 12 else 0
    else:
        start_hour = 0 if start_hour == 12 else start_hour

    end_minute = start_minute + duration_minute
    extra_hour = end_minute // 60
    end_minute %= 60

    end_hour = start_hour + duration_hour + extra_hour
    days_later = end_hour // 24
    end_hour %= 24

    # convert back to AM/PM format for readability
    new_period = "AM" if end_hour < 12 else "PM"
    display_hour = end_hour % 12
    display_hour = 12 if display_hour == 0 else display_hour

    formatted_minute = f'{end_minute:02d}'
    new_time = f'{display_hour}:{formatted_minute} {new_period}'

    if day_of_week:
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        day_index = days.index(day_of_week.capitalize())
        new_day_index = (day_index + days_later) % 7
        new_day = days[new_day_index]
        new_time = f'{display_hour}:{formatted_minute} {new_period}, {new_day}'

    if days_later == 1:
        new_time += ' (next day)'
    elif days_later > 1:
        new_time += f' ({days_later} days later)'

    return new_time

print(add_time('3:30 PM', '2:12'))




