import { Button } from "./Button";
import { Card } from "./Card";
import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export const DateSelector = ({ onDateSelect, selectedDate }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  useEffect(() => {
    const today = new Date();
    setCurrentWeek(today);
  }, []);

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

 
  const getCurrentWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    now.setDate(diff);
    now.setHours(0, 0, 0, 0);
    return now;
  };

  const currentWeekStart = getCurrentWeekStart();
  const selectedWeekStart = new Date(weekDates[0]);
  selectedWeekStart.setHours(0, 0, 0, 0);

  const canNavigatePrevious = selectedWeekStart > currentWeekStart;

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const navigateWeek = (direction) => {
    if (direction === -1 && !canNavigatePrevious) {
      return; 
    }
    
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  const getMonthYear = () => {
    const firstDate = weekDates[0];
    const lastDate = weekDates[6];
    
    if (firstDate.getMonth() === lastDate.getMonth()) {
      return firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else {
      return `${firstDate.toLocaleDateString('en-US', { month: 'short' })} - ${lastDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Pick Your Day
        </h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            onClick={() => navigateWeek(-1)}
            disabled={!canNavigatePrevious}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium px-3 min-w-[200px] text-center">
            {getMonthYear()}
          </span>
          <Button variant="secondary" onClick={() => navigateWeek(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="mb-2 text-center text-sm text-gray-600">
        {weekDates[0].toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - {weekDates[6].toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, index) => {
          const isPast = date < today;
          const isSelected = selectedDate === formatDate(date);
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <button
              key={index}
              onClick={() => !isPast && onDateSelect(formatDate(date))}
              disabled={isPast}
              className={`p-3 rounded-lg text-center transition-colors duration-200 relative ${
                isPast 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : isSelected
                    ? 'bg-blue-600 text-white'
                    : isToday
                      ? 'bg-green-100 hover:bg-green-200 text-green-800 border-2 border-green-300'
                      : 'bg-gray-50 hover:bg-blue-100 text-gray-800'
              }`}
            >
              <div className="text-xs font-medium">{getDayName(date)}</div>
              <div className="text-lg font-bold">{date.getDate()}</div>
              <div className="text-xs">
                {isPast ? 'Past' : isToday ? 'Today' : 'Available'}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};