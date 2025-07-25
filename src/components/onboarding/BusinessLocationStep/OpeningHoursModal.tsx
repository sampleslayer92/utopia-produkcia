
import { useState, useEffect } from "react";
import { Clock, Calendar, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import OnboardingInput from "../ui/OnboardingInput";
import { OpeningHours } from "@/types/onboarding";

interface OpeningHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHours: OpeningHours[];
  onSave: (hours: OpeningHours[]) => void;
}

const OpeningHoursModal = ({ isOpen, onClose, initialHours, onSave }: OpeningHoursModalProps) => {
  const { t } = useTranslation('forms');

  const daysOfWeek: Array<{ key: OpeningHours['day'], label: string, shortLabel: string }> = [
    { key: "Po", label: t('businessLocation.openingHours.days.pondelok'), shortLabel: t('businessLocation.openingHours.days.po') },
    { key: "Ut", label: t('businessLocation.openingHours.days.utorok'), shortLabel: t('businessLocation.openingHours.days.ut') },
    { key: "St", label: t('businessLocation.openingHours.days.streda'), shortLabel: t('businessLocation.openingHours.days.st') },
    { key: "Št", label: t('businessLocation.openingHours.days.stvrtok'), shortLabel: t('businessLocation.openingHours.days.st2') },
    { key: "Pi", label: t('businessLocation.openingHours.days.piatok'), shortLabel: t('businessLocation.openingHours.days.pi') },
    { key: "So", label: t('businessLocation.openingHours.days.sobota'), shortLabel: t('businessLocation.openingHours.days.so') },
    { key: "Ne", label: t('businessLocation.openingHours.days.nedela'), shortLabel: t('businessLocation.openingHours.days.ne') }
  ];

  const [localHours, setLocalHours] = useState<OpeningHours[]>([]);
  const [selectedDays, setSelectedDays] = useState<Set<OpeningHours['day']>>(new Set());
  const [sameTimeForAll, setSameTimeForAll] = useState(false);
  const [uniformOpen, setUniformOpen] = useState("09:00");
  const [uniformClose, setUniformClose] = useState("17:00");

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      // Initialize with existing hours or defaults
      const initialHoursData = initialHours.length > 0 ? initialHours : daysOfWeek.map(day => ({
        day: day.key,
        open: "09:00",
        close: "17:00",
        otvorene: day.key !== "So" && day.key !== "Ne"
      }));
      
      setLocalHours(initialHoursData);
      
      // Set selected days (those that are open)
      const openDays = new Set(initialHoursData.filter(h => h.otvorene).map(h => h.day));
      setSelectedDays(openDays);
      
      // Check if all open days have same time
      const openHours = initialHoursData.filter(h => h.otvorene);
      if (openHours.length > 0) {
        const firstOpen = openHours[0];
        const allSameTime = openHours.every(h => h.open === firstOpen.open && h.close === firstOpen.close);
        setSameTimeForAll(allSameTime);
        if (allSameTime) {
          setUniformOpen(firstOpen.open);
          setUniformClose(firstOpen.close);
        }
      }
    }
  }, [isOpen, initialHours]);

  const toggleDay = (day: OpeningHours['day']) => {
    const newSelectedDays = new Set(selectedDays);
    if (newSelectedDays.has(day)) {
      newSelectedDays.delete(day);
    } else {
      newSelectedDays.add(day);
    }
    setSelectedDays(newSelectedDays);
    
    // Update local hours
    setLocalHours(prev => prev.map(h => ({
      ...h,
      otvorene: newSelectedDays.has(h.day)
    })));
  };

  const quickActionWorkWeek = () => {
    const workDays: OpeningHours['day'][] = ["Po", "Ut", "St", "Št", "Pi"];
    setSelectedDays(new Set(workDays));
    setSameTimeForAll(true);
    setUniformOpen("09:00");
    setUniformClose("17:00");
    
    setLocalHours(prev => prev.map(h => ({
      ...h,
      otvorene: workDays.includes(h.day),
      open: workDays.includes(h.day) ? "09:00" : h.open,
      close: workDays.includes(h.day) ? "17:00" : h.close
    })));
  };

  const quickActionFullWeek = () => {
    const allDays: OpeningHours['day'][] = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];
    setSelectedDays(new Set(allDays));
    setSameTimeForAll(true);
    setUniformOpen("09:00");
    setUniformClose("17:00");
    
    setLocalHours(prev => prev.map(h => ({
      ...h,
      otvorene: true,
      open: "09:00",
      close: "17:00"
    })));
  };

  const quickActionWeekends = () => {
    const weekendDays: OpeningHours['day'][] = ["So", "Ne"];
    setSelectedDays(new Set(weekendDays));
    setSameTimeForAll(true);
    setUniformOpen("10:00");
    setUniformClose("14:00");
    
    setLocalHours(prev => prev.map(h => ({
      ...h,
      otvorene: weekendDays.includes(h.day),
      open: weekendDays.includes(h.day) ? "10:00" : h.open,
      close: weekendDays.includes(h.day) ? "14:00" : h.close
    })));
  };

  const quickActionClosed = () => {
    setSelectedDays(new Set());
    setSameTimeForAll(false);
    
    setLocalHours(prev => prev.map(h => ({
      ...h,
      otvorene: false
    })));
  };

  const quickActionReset = () => {
    const workDays: OpeningHours['day'][] = ["Po", "Ut", "St", "Št", "Pi"];
    setSelectedDays(new Set(workDays));
    setSameTimeForAll(true);
    setUniformOpen("09:00");
    setUniformClose("17:00");
    
    setLocalHours(daysOfWeek.map(day => ({
      day: day.key,
      open: "09:00",
      close: "17:00",
      otvorene: workDays.includes(day.key)
    })));
  };

  const updateUniformTime = (field: 'open' | 'close', value: string) => {
    if (field === 'open') {
      setUniformOpen(value);
    } else {
      setUniformClose(value);
    }
    
    if (sameTimeForAll) {
      setLocalHours(prev => prev.map(h => ({
        ...h,
        [field]: selectedDays.has(h.day) ? value : h[field]
      })));
    }
  };

  const updateDayTime = (day: OpeningHours['day'], field: 'open' | 'close', value: string) => {
    setLocalHours(prev => prev.map(h => 
      h.day === day ? { ...h, [field]: value } : h
    ));
  };

  const handleSameTimeToggle = (checked: boolean) => {
    setSameTimeForAll(checked);
    
    if (checked && selectedDays.size > 0) {
      // Use first selected day's time as uniform time
      const firstSelectedDay = Array.from(selectedDays)[0];
      const firstDayHours = localHours.find(h => h.day === firstSelectedDay);
      
      if (firstDayHours) {
        setUniformOpen(firstDayHours.open);
        setUniformClose(firstDayHours.close);
        
        // Apply to all selected days
        setLocalHours(prev => prev.map(h => ({
          ...h,
          open: selectedDays.has(h.day) ? firstDayHours.open : h.open,
          close: selectedDays.has(h.day) ? firstDayHours.close : h.close
        })));
      }
    }
  };

  const handleSave = () => {
    onSave(localHours);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            {t('businessLocation.modal.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {t('businessLocation.modal.quickActions')}
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={quickActionWorkWeek}
                className="text-xs"
              >
                {t('businessLocation.modal.quickActionButtons.workWeek')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={quickActionFullWeek}
                className="text-xs"
              >
                {t('businessLocation.modal.quickActionButtons.fullWeek')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={quickActionWeekends}
                className="text-xs"
              >
                {t('businessLocation.modal.quickActionButtons.weekends')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={quickActionClosed}
                className="text-xs"
              >
                {t('businessLocation.modal.quickActionButtons.closed')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={quickActionReset}
                className="text-xs"
              >
                {t('businessLocation.modal.quickActionButtons.reset')}
              </Button>
            </div>
          </div>

          {/* Day Selector */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('businessLocation.modal.daySelection')}
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(({ key, label, shortLabel }) => (
                <Badge
                  key={key}
                  variant={selectedDays.has(key) ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-2 text-sm transition-colors ${
                    selectedDays.has(key) 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'hover:bg-blue-50 hover:border-blue-300'
                  }`}
                  onClick={() => toggleDay(key)}
                >
                  <span className="md:hidden">{shortLabel}</span>
                  <span className="hidden md:inline">{label}</span>
                </Badge>
              ))}
            </div>
            
            <p className="text-xs text-slate-500">
              {t('businessLocation.modal.daySelectionDescription')}
            </p>
          </div>

          {/* Time Settings */}
          {selectedDays.size > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sameTime"
                  checked={sameTimeForAll}
                  onCheckedChange={handleSameTimeToggle}
                />
                <label htmlFor="sameTime" className="text-sm font-medium text-slate-700">
                  {t('businessLocation.modal.sameTimeLabel')}
                </label>
              </div>

              {sameTimeForAll ? (
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">{t('businessLocation.modal.openingLabel')}</label>
                    <OnboardingInput
                      type="time"
                      value={uniformOpen}
                      onChange={(e) => updateUniformTime('open', e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">{t('businessLocation.modal.closingLabel')}</label>
                    <OnboardingInput
                      type="time"
                      value={uniformClose}
                      onChange={(e) => updateUniformTime('close', e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {Array.from(selectedDays).map(day => {
                    const dayData = daysOfWeek.find(d => d.key === day);
                    const dayHours = localHours.find(h => h.day === day);
                    
                    return (
                      <div key={day} className="grid grid-cols-3 gap-4 items-center p-3 bg-slate-50 rounded-lg">
                        <div className="font-medium text-slate-700">
                          {dayData?.label}
                        </div>
                        <div>
                          <OnboardingInput
                            type="time"
                            value={dayHours?.open || "09:00"}
                            onChange={(e) => updateDayTime(day, 'open', e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <div>
                          <OnboardingInput
                            type="time"
                            value={dayHours?.close || "17:00"}
                            onChange={(e) => updateDayTime(day, 'close', e.target.value)}
                            className="h-9"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {selectedDays.size === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>{t('businessLocation.modal.selectDaysMessage')}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t('businessLocation.modal.cancelButton')}
          </Button>
          <Button onClick={handleSave}>
            {t('businessLocation.modal.saveButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpeningHoursModal;
