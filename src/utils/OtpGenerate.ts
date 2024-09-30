export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

export const getOtpExpiry = (durationInMinutes: number): number => {
  return Date.now() + durationInMinutes * 60 * 1000; // Current time + duration in milliseconds
};
