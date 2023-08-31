export const generateWhatsAppShareLink = (
  phoneNumber: string,
  text: string
) => {
  const baseUrl = "https://api.whatsapp.com/send";

  let params = {};
  if (text) params.text = text;
  if (phoneNumber) params.phone = phoneNumber;

  params = new URLSearchParams({
    phone: phoneNumber,
    text: text,
  });

  const whatsappShareLink = `${baseUrl}?${params.toString()}`;
  return whatsappShareLink;
};

export const generateLineShareLink = (text: string) => {
  const baseUrl = "https://social-plugins.line.me/lineit/share";
  const params = new URLSearchParams({
    text: text,
  });
  const lineShareLink = `${baseUrl}?${params.toString()}`;
  return lineShareLink;
};

export const generateTelegramShareLink = (text: string) => {
  const baseUrl = "https://t.me/share/url";
  const params = new URLSearchParams({
    text: text,
  });
  const telegramShareLink = `${baseUrl}?${params.toString()}`;
  return telegramShareLink;
};
