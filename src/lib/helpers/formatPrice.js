export const formatPrice = (price) => {
  if (!price) return '가격 정보 없음';
  
  // If price is already formatted (e.g. "12억", "1억 5천")
  if (typeof price === 'string') {
    return price;
  }
  
  // If price is a number, format it
  if (typeof price === 'number') {
    if (price >= 100000000) {
      // Convert to 억 (100 million)
      const billion = Math.floor(price / 100000000);
      const million = price % 100000000;
      
      if (million === 0) {
        return `${billion}억`;
      } else {
        const millionFormatted = Math.floor(million / 10000);
        return `${billion}억 ${millionFormatted}만`;
      }
    } else if (price >= 10000) {
      // Convert to 만 (10 thousand)
      const tenThousand = Math.floor(price / 10000);
      return `${tenThousand}만`;
    } else {
      return `${price.toLocaleString()}원`;
    }
  }
  
  return String(price);
};

export const formatMonthlyPrice = (deposit, monthly) => {
  if (!deposit && !monthly) return '가격 정보 없음';
  
  const depositFormatted = deposit ? formatPrice(deposit) : '0';
  const monthlyFormatted = monthly ? formatPrice(monthly) : '0';
  
  return `${depositFormatted}/${monthlyFormatted}`;
};