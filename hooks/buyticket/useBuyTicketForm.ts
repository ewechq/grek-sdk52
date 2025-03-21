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

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('• Укажите ваше имя');
    }
    if (!formData.phone.trim()) {
      errors.push('• Укажите номер телефона');
    }
    if (!formData.email.trim()) {
      errors.push('• Укажите email');
    }
    if (guestCounts.onetofour === 0 && guestCounts.fivetosixteen === 0) {
      errors.push('• Выберите количество детей');
    }

    const missingAgreements: string[] = [];
    if (!agreements.privacy) missingAgreements.push('политикой конфиденциальности');
    if (!agreements.rules) missingAgreements.push('правилами посещения');
    if (!agreements.offer) missingAgreements.push('договором оферты');

    if (missingAgreements.length > 0) {
      errors.push(`• Необходимо согласиться с: ${missingAgreements.join(', ')}`);
    }

    return errors.length > 0 ? errors : null;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors) {
      return { error: errors.join('\n') };
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

      const signatureResponse = await fetch('https://dev.api.grekland.ru/api/ticket/signature', {
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
          return { success: true };
        } catch (navigationError) {
          return { error: 'Ошибка при переходе на страницу подтверждения' };
        }
      } else {
        return { error: signatureResult.message || 'Ошибка при получении подписи' };
      }
    } catch (error) {
      return { error: 'Ошибка при отправке запроса' };
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
    validateForm
  };
}; 