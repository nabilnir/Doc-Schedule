// এখানে আপনি আপনার ইচ্ছা মতো ডিসকাউন্ট পার্সেন্টেজ পরিবর্তন করতে পারবেন
export const DISCOUNT_CONFIG = {
  free: 0,
  monthly: 0.05,   // ৫% ডিসকাউন্ট
  yearly: 0.10,    // ১০% ডিসকাউন্ট
};

export function calculateFinalPrice(basePrice, plan) {
  // প্ল্যান অনুযায়ী ডিসকাউন্ট রেট বের করা (ডিফল্ট ০)
  const discountRate = DISCOUNT_CONFIG[plan] || 0;
  const discountAmount = basePrice * discountRate;
  
  return {
    originalPrice: basePrice,
    discountAmount: discountAmount,
    finalPrice: basePrice - discountAmount,
    hasDiscount: discountAmount > 0,
    discountPercentage: discountRate * 100 // UI তে দেখানোর জন্য (যেমন: 5 বা 10)
  };
}