interface MonthlyValueDisplayProps {
  value: number;
}

const MonthlyValueDisplay = ({ value }: MonthlyValueDisplayProps) => {
  const formatValue = (val: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  const getColor = () => {
    if (value >= 1000) return "text-emerald-600 font-semibold";
    if (value >= 500) return "text-blue-600 font-medium";
    if (value >= 100) return "text-slate-700";
    return "text-slate-500";
  };

  return (
    <span className={getColor()}>
      {formatValue(value)}
    </span>
  );
};

export default MonthlyValueDisplay;