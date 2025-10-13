import { useState } from 'react';
import TopBar from '../components/TopBar';
import Button from '../components/Button';

export default function InterpretResultsPage() {

  return (
    <div className="px-10 py-5 bg-gray-50 min-h-screen">
      <div className="pb-5">
        <TopBar />
      </div>

      <div className="flex bg-white rounded-2xl shadow-sm min-h-[500px] p-5">
        <h1>Interpreting your results</h1>
      </div>
    </div>
  );
}
