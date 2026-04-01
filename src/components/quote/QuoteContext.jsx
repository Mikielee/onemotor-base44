import { createContext, useContext, useState, useCallback } from 'react';

const QuoteContext = createContext({ showPriceBar: false, footerContent: null, setFooterContent: () => {} });

export function QuoteProvider({ showPriceBar, children }) {
  const [footerContent, setFooterContentRaw] = useState(null);
  const setFooterContent = useCallback((content) => setFooterContentRaw(content), []);

  return (
    <QuoteContext.Provider value={{ showPriceBar, footerContent, setFooterContent }}>
      {children}
    </QuoteContext.Provider>
  );
}

export const useQuoteContext = () => useContext(QuoteContext);