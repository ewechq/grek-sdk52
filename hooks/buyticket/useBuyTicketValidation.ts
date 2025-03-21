import { useState } from 'react';
import { BuyTicketFormData } from '@/types/buyticket';

interface ValidationErrors {
  name?: string;
  phone?: string;
  email?: string;
}

export const useBuyTicketValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isNameValid, setIsNameValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const validateForm = (formData: BuyTicketFormData): string[] => {
    const newErrors: string[] = [];

    if (!isNameValid && formData.name.trim()) {
      newErrors.push('• Введите корректное ФИО (минимум 2 символа)');
    }
    if (!isPhoneValid && formData.phone.trim()) {
      newErrors.push('• Введите корректный номер телефона');
    }
    if (!isEmailValid && formData.email.trim()) {
      newErrors.push('• Введите корректный email (например: name@example.com)');
    }

    return newErrors;
  };

  return {
    errors,
    setErrors,
    isNameValid,
    setIsNameValid,
    isPhoneValid,
    setIsPhoneValid,
    isEmailValid,
    setIsEmailValid,
    validateForm
  };
}; 