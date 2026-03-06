import type { CalendarDay } from '../types';

interface StreakCalendarProps {
  calendar: CalendarDay[];
}

export function StreakCalendar({ calendar }: StreakCalendarProps) {
  // Get last 30 days (calendar is already sorted desc from API)
  const days = calendar.slice(0, 30);

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const date = new Date(day.date);
          const dayNum = date.getDate();
          const isToday = index === 0;

          return (
            <div
              key={day.date}
              className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all ${
                day.has_activity
                  ? isToday
                    ? 'bg-blue-600 text-white scale-110 shadow-lg'
                    : 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
              }`}
            >
              {dayNum}
            </div>
          );
        })}
      </div>
    </div>
  );
}
