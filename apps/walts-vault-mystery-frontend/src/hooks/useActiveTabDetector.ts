import { useEffect, useState } from 'react';

export default function useActiveTabDetector() {
  const [isTabActive, setIsTabActive] = useState(true);

  useEffect(() => {
    const handleFocus = () => setIsTabActive(true);
    const handleBlur = () => setIsTabActive(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return { isTabActive };
}
