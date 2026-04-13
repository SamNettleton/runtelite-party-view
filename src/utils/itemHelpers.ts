// Helper for OSRS quantity colors

export const getQtyColor = (qty: number) => {
  if (qty >= 10000000) return '#00ff80'; // 10M+ is Green
  if (qty >= 100000) return '#ffffff'; // 100K+ is White
  return '#ffff00'; // Default is Yellow
};

export const formatQty = (qty: number) => {
  if (qty >= 10000000) return `${Math.floor(qty / 1000000)}M`;
  if (qty >= 100000) return `${Math.floor(qty / 1000)}K`;
  return qty;
};
