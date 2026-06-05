export function truncateString(str : string, maxLength : number = 125) {
   if (str?.length > maxLength) {
       return str.substring(0, maxLength) + '...';
   }
   return str;
}

export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const snakeToTitleCase = (value: string) => {
  return value
    .split('_')
    .filter((x) => x.length > 0)
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(' ')
}

export const kebabToTitleCase = (value: string) => {
  return value
    .split('-')
    .filter((x) => x.length > 0)
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(' ')
}

export const toSentenceCase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export const formatMessageDeliveryTime = (isoString: string): string => {
  const date = new Date(isoString);

  // Opsi format tanggal dan waktu untuk locale Indonesia
  const optionsDate: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Gunakan format 24 jam
  };

  // Konversi ke waktu lokal (WIB)
  const localDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })); // Waktu saat ini di WIB

  const formattedTime = localDate.toLocaleTimeString('id-ID', optionsTime);

  // Cek apakah tanggalnya hari ini
  if (localDate.toDateString() === now.toDateString()) {
    return `Hari Ini, ${formattedTime} WIB`;
  }

  // Cek apakah tanggalnya kemarin
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (localDate.toDateString() === yesterday.toDateString()) {
    return `Kemarin, ${formattedTime} WIB`;
  }

  // Jika bukan hari ini atau kemarin, tampilkan tanggal lengkap
  const formattedDate = localDate.toLocaleDateString('id-ID', optionsDate);
  return `${formattedDate}, ${formattedTime} WIB`;
};

export const formatCreationDate = (isoString: string): string => {
  if (typeof isoString !== 'string' || !isoString.trim()) {
    console.error("Input tidak valid: isoString harus berupa string non-kosong.");
    return "tanggal tidak dikenal";
  }


  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    console.error(`Input tanggal tidak valid: "${isoString}"`);
    return "tanggal tidak valid";
  }

  // Opsi format tanggal
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Gunakan format 24 jam
    // timezone: 'Asia/Jakarta' // Opsional: Tentukan zona waktu jika perlu override zona waktu lokal pengguna
  };

  try {
    const formattedDate = new Intl.DateTimeFormat('id-ID', options).format(date);
    return `${formattedDate}`;
  } catch (error) {
    console.error("Error saat memformat tanggal:", error);
    return "tanggal tidak dapat diformat";
  }
};