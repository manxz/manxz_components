/**
 * Expo Preview App - Component Library Navigator
 * 
 * Scan QR code with Expo Go to see components on your phone!
 */

import React, { useState } from 'react';
import ComponentList from './ComponentList';
import ButtonPreview from './ButtonPreview';

type Screen = 'list' | 'button';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('list');

  const components = [
    {
      id: 'button',
      name: 'Button',
    },
  ];

  const handleSelectComponent = (componentId: string) => {
    setCurrentScreen(componentId as Screen);
  };

  const handleBack = () => {
    setCurrentScreen('list');
  };

  if (currentScreen === 'button') {
    return <ButtonPreview onBack={handleBack} />;
  }

  return (
    <ComponentList
      components={components}
      onSelectComponent={handleSelectComponent}
    />
  );
}
