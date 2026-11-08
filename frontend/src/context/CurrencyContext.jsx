// ==============================================================================
// CURRENCY CONTEXT (frontend/src/context/CurrencyContext.jsx)
// Multi-Currency Converter (EUR, USD, GBP) Aur Web Service Consumer
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. React hooks import karna
import React, { createContext, useContext, useState, useEffect } from 'react';

// 2. Context create karna
const CurrencyContext = createContext();

/**
 * 3. CurrencyProvider Component: Poori website mein currency badalne ki sahulat deta hai
 */
export const CurrencyProvider = ({ children }) => {
  // Current currency state (Default: EUR)
  const [currency, setCurrency] = useState('EUR');
  
  // Exchange rates state (Fallback values agar API slow ho)
  const [rates, setRates] = useState({
    EUR: 1.0,
    USD: 1.08,
    GBP: 0.86
  });

  // Har currency ka nishan (Symbol)
  const currencySymbols = {
    EUR: '€',
    USD: '$',
    GBP: '£'
  };

  // 4. useEffect: Page load hote hi backend se live rates fetch karna
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('/api/external/rates');
        const data = await response.json();
        if (data.success && data.rates) {
          setRates(data.rates); // Live rates se update karo
        }
      } catch (e) {
        console.warn('Default currency rates istemal ho rahe hain');
      }
    };
    fetchRates();
  }, []);

  /**
   * 5. formatAmount: Euro ki amount ko user ki pasandeeda currency mein badalne ka math formula
   * Example: Agar amount 100 EUR hai aur currency USD hai: 100 * 1.08 = $108
   */
  const formatAmount = (amountInEUR) => {
    const rate = Number(rates[currency]) || 1;
    const converted = (amountInEUR * rate).toFixed(0);
    const symbol = currencySymbols[currency] || '€';
    return `${symbol}${Number(converted).toLocaleString()}`;
  };

  return (
    // Har component ko currency, setCurrency, formatAmount aur symbol faraham karna
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, formatAmount, symbol: currencySymbols[currency] }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom Hook taake asani se useCurrency() call kiya ja sakay
export const useCurrency = () => useContext(CurrencyContext);
