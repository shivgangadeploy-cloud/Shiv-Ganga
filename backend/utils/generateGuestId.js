export const generateGuestId = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `SGH-${Date.now().toString().slice(-4)}-${random}`;
};
