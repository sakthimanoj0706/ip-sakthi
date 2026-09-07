import React from 'react';
import { ProgressStepper } from '../../components/ProgressStepper';
import { SmartInterview } from '../../components/SmartInterview';

export default function InterviewPage() {
  return (
    <div className="space-y-4 pb-12">
      <ProgressStepper />
      <SmartInterview />
    </div>
  );
}
