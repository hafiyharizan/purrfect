'use client';

import { useState, type FormEvent } from 'react';
import { isLikelyInServiceArea } from '@/lib/bookings';

export function SuburbChecker() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleCheck = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(
      !value.trim()
        ? 'Please enter a suburb or postcode first.'
        : isLikelyInServiceArea(value)
          ? 'Looks likely within the usual service area. Final travel will be confirmed.'
          : 'Please request a booking and travel fee will be confirmed if needed.',
    );
  };

  return (
    <form className="suburb-checker" onSubmit={handleCheck}>
      <h3>Check Your Suburb</h3>
      <input
        aria-label="Suburb or postcode"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setResult(null);
        }}
        placeholder="Enter suburb or postcode"
      />
      <button className="primary-button" type="submit">Check</button>
      {result && <p>{result}</p>}
    </form>
  );
}
