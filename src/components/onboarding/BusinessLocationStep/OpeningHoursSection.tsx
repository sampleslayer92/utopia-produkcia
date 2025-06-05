
import { useState } from "react";
import { Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import OnboardingInput from "../ui/OnboardingInput";
import { OpeningHours } from "@/types/onboarding";

interface OpeningHoursSectionProps {
  openingHoursDetailed: OpeningHours[];
  onUpdate: (hours: OpeningHours[]) => void;
}

const OpeningHoursSection = ({ openingHoursDetailed, onUpdate }: OpeningHoursSectionProps) => {
  const daysOfWeek: Array<{ key: OpeningHours['day'], label: string }> = [
    { key: "Po", label: "Pondelok" },
    { key: "Ut", label: "Utorok" },
    { key: "St", label: "Streda" },
    { key: "Št", label: "Štvrtok" },
    { key: "Pi", label: "Piatok" },
    { key: "So", label: "Sobota" },
    { key: "Ne", label: "Nedeľa" }
  ];

  // Initialize opening hours if empty
  const initializeOpeningHours = () => {
    if (openingHoursDetailed.length === 0) {
      const defaultHours: OpeningHours[] = daysOfWeek.map(day => ({
        day: day.key,
        open: "09:00",
        close: "17:00",
        otvorene: day.key !== "So" && day.key !== "Ne" // Default: weekdays open, weekends closed
      }));
      onUpdate(defaultHours);
      return defaultHours;
    }
    return openingHoursDetailed;
  };

  const currentHours = initializeOpeningHours();

  const updateDayHours = (day: OpeningHours['day'], field: keyof OpeningHours, value: any) => {
    const updated = currentHours.map(hour => {
      if (hour.day === day) {
        return { ...hour, [field]: value };
      }
      return hour;
    });
    onUpdate(updated);
  };

  const getDayHours = (day: OpeningHours['day']): OpeningHours => {
    return currentHours.find(h => h.day === day) || {
      day,
      open: "09:00",
      close: "17:00",
      otvorene: true
    };
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Otváracie hodiny
      </h4>

      <div className="space-y-3">
        {daysOfWeek.map(({ key, label }) => {
          const dayHours = getDayHours(key);
          
          return (
            <div key={key} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-3 border border-slate-200 rounded-lg bg-slate-50">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`day-${key}`}
                  checked={dayHours.otvorene}
                  onCheckedChange={(checked) => updateDayHours(key, 'otvorene', checked)}
                />
                <label htmlFor={`day-${key}`} className="text-sm font-medium text-slate-700 min-w-[80px]">
                  {label}
                </label>
              </div>

              {dayHours.otvorene ? (
                <>
                  <div>
                    <OnboardingInput
                      type="time"
                      value={dayHours.open}
                      onChange={(e) => updateDayHours(key, 'open', e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-slate-500 text-sm">do</span>
                  </div>
                  <div>
                    <OnboardingInput
                      type="time"
                      value={dayHours.close}
                      onChange={(e) => updateDayHours(key, 'close', e.target.value)}
                      className="h-10"
                    />
                  </div>
                </>
              ) : (
                <div className="md:col-span-3 flex items-center">
                  <span className="text-slate-500 text-sm italic">Zatvorené</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-500">
        Zaškrtnite dni, kedy je prevádzka otvorená a zadajte otváracie hodiny.
      </p>
    </div>
  );
};

export default OpeningHoursSection;
