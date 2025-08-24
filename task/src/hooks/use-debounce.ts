<<<<<<< HEAD
"use client";

import { useState, useEffect } from "react";
=======
import { useState, useEffect } from 'react';
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
<<<<<<< HEAD
}
=======
}
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60
