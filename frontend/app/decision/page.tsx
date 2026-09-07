import React from 'react';
import { ProgressStepper } from '../../components/ProgressStepper';
import { DecisionMap } from '../../components/DecisionMap';

export default function DecisionPage() {
  return (
    <div className="space-y-4 pb-12">
      <ProgressStepper />
      <DecisionMap />
    </div>
  );
}
