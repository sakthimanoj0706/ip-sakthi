import React from 'react';
import { ProgressStepper } from '../../components/ProgressStepper';
import { RoadmapSection } from '../../components/RoadmapSection';

export default function RoadmapPage() {
  return (
    <div className="space-y-4 pb-12">
      <ProgressStepper />
      <RoadmapSection />
    </div>
  );
}
