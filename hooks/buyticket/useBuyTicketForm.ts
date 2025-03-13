import { useState } from 'react';
import { useRouter } from 'expo-router';

interface FormData {
  name: string;
  phone: string;
  email: string;
}

interface GuestCounts {
  onetofour: number;
  fivetosixteen: number;
}

interface Agreements {
  privacy: boolean;
  rules: boolean;
  offer: boolean;
  price: boolean;
}

interface TicketData {
  name: string;
  phone: string;
  email: string;
  childage: string[];
}

export const useBuyTicketForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
  });

  const [guestCounts, setGuestCounts] = useState<GuestCounts>({
    onetofour: 0,
    fivetosixteen: 0,
  });

  const [agreements, setAgreements] = useState<Agreements>({
    privacy: false,
    rules: false,
    offer: false,
    price: false,
  });

  const [ticketData, setTicketData] = useState<TicketData | null>(null);

  const isFormValid = () => {
    const isPersonalDataFilled = formData.name.trim() && 
                                formData.phone.trim() && 
                                formData.email.trim();
    
    const hasTickets = guestCounts.onetofour > 0 || guestCounts.fivetosixteen > 0;
    
    const isAgreementsAccepted = agreements.privacy && 
                                agreements.rules && 
                                agreements.offer;

    return isPersonalDataFilled && hasTickets && isAgreementsAccepted;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      console.log('Форма не валидна:', {
        hasTickets: guestCounts.onetofour > 0 || guestCounts.fivetosixteen > 0,
        personalDataFilled: formData.name && formData.phone && formData.email,
        agreementsAccepted: agreements.privacy && agreements.rules && agreements.offer
      });
      return;
    }

    try {
      const requestData = {
        "name": formData.name,
        "phone": "+" + formData.phone.replace(/\D/g, ''),
        "email": formData.email,
        "childage": [] as string[]
      };

      if (guestCounts.onetofour > 0) {
        for (let i = 0; i < guestCounts.onetofour; i++) {
          requestData.childage.push("1-4");
        }
      }

      if (guestCounts.fivetosixteen > 0) {
        for (let i = 0; i < guestCounts.fivetosixteen; i++) {
          requestData.childage.push("5-16");
        }
      }

      setTicketData(requestData);

      const signatureResponse = await fetch('https://api.grekland.ru/api/ticket/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          phone: requestData.phone
        })
      });

      const signatureResult = await signatureResponse.json();

      if (signatureResponse.ok && signatureResult.signature?.id) {
        const newSignatureId = signatureResult.signature.id;
        
        try {
          router.push({
            pathname: '/(buyticket)/sms',
            params: { 
              signatureId: newSignatureId,
              ticketData: JSON.stringify(requestData)
            }
          });
        } catch (navigationError) {
          console.error('Ошибка при навигации:', navigationError);
        }
      } else {
        console.error('Ошибка при получении подписи:', signatureResult.message || 'Неизвестная ошибка');
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
  };

  return {
    formData,
    setFormData,
    guestCounts,
    setGuestCounts,
    agreements,
    setAgreements,
    handleSubmit,
    isFormValid
  };
}; 