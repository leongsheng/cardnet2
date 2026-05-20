export function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function exportVCard(contact: any) {
  let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${contact.lastName};${contact.firstName};;;\nFN:${contact.firstName} ${contact.lastName}\nORG:${contact.organization}\nTITLE:${contact.title}\nEMAIL;TYPE=INTERNET:${contact.email}\nTEL;TYPE=CELL:${contact.phone}\nURL:${contact.website}\nADR:;;${contact.address};;;;\n`;
  if (contact.avatarBase64) {
    const base64Data = contact.avatarBase64.split(",")[1];
    vcard += `PHOTO;ENCODING=b;TYPE=JPEG:${base64Data}\n`;
  }
  vcard += `END:VCARD`;

  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${contact.firstName}_${contact.lastName}.vcf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    // Fallback for iframe sandbox restrictions
    window.open(url, "_blank");
  }
  
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
