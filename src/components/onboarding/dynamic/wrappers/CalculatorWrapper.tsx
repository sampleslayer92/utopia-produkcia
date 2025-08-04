import React from 'react';
import RealTimeProfitCalculator from '../../fees/RealTimeProfitCalculator';
import { ModuleComponentProps } from '../ModuleComponentRegistry';

const CalculatorWrapper = ({ 
  data, 
  updateData, 
  configuration = {},
  isReadOnly = false 
}: ModuleComponentProps) => {
  return (
    <div className="space-y-6">
      <RealTimeProfitCalculator 
        data={data} 
        updateData={updateData} 
        isReadOnly={isReadOnly} 
      />
    </div>
  );
};

export default CalculatorWrapper;