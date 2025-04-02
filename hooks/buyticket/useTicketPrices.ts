import { useState, useEffect } from 'react';

interface TicketPrice {
  "1-4": number;
  "5-16": number;
  "attendant": number;
}

export const useTicketPrices = () => {
  const [prices, setPrices] = useState<TicketPrice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.grekland.ru/api/ticket/price');
        const data = await response.json();
        setPrices(data);
      } catch (error) {
        console.error('Error fetching ticket prices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return { prices, isLoading };
}; 