export function cleanPhoneNumber(phoneNumber: string): string {
    let cleanedNumber = phoneNumber.replace(/\D/g, '');
  
    if (cleanedNumber.startsWith('0')) {
      cleanedNumber = cleanedNumber.substring(1); // Remove leading zero
    } else if (cleanedNumber.startsWith('234')) {
      cleanedNumber = cleanedNumber.substring(3); // Remove country code '234'
    } else if (cleanedNumber.startsWith('+234')) {
      cleanedNumber = cleanedNumber.substring(4); // Remove country code '+234'
    }
  
    // Check if the resulting number is not more than 10 digits
    if (cleanedNumber.length != 10) {
      throw new Error('Invalid Phone Number');
    }
  
    return cleanedNumber;
  }