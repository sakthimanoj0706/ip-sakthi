import React from 'react';
import { ProgressStepper } from '../../components/ProgressStepper';
import { InnovationInput } from '../../components/InnovationInput';

export default function AnalyzePage() {
  return (
    <div className="space-y-4 pb-12">
      <ProgressStepper />
      <InnovationInput />
    </div>
  );
}
