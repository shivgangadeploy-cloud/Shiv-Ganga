export const generateBookingReference = ({
  checkInDate,
  checkOutDate,
  firstName,
  lastName,
  phoneNumber,
  email,
}) => {
  const toStr = (v) => {
    if (!v) return "";
    try {
      if (v instanceof Date) return v.toISOString();
      if (typeof v === "string") return v.trim();
      return String(v);
    } catch {
      return String(v || "");
    }
  };
  const seed = [
    toStr(checkInDate),
    toStr(checkOutDate),
    toStr(firstName),
    toStr(lastName),
    toStr(phoneNumber),
    toStr(email),
  ].join("|");
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000000007;
  }
  const code = String(Math.abs(hash) % 10000).padStart(4, "0");
  return `#SHIV-${code}`;
};
