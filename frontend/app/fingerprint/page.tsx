import React from 'react';
import { ProgressStepper } from '../../components/ProgressStepper';
import { FingerprintCard } from '../../components/FingerprintCard';

export default function FingerprintPage() {
  return (
    <div className="space-y-4 pb-12">
      <ProgressStepper />
      <FingerprintCard />
    </div>
  );
}
