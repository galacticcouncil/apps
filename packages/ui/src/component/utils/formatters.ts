export function amountFormatter(amount: string): string {
  const amountNo = Number(amount);
  if (Number.isInteger(amountNo)) {
    const formattedNo = new Intl.NumberFormat('en-US').format(amountNo);
    return formattedNo.replaceAll(',', ' ');
  }

  let maxSignDigits: number = 4;
  if (amountNo > 1) {
    const intPartLen = Math.ceil(Math.log10(Number(amountNo) + 1));
    maxSignDigits = maxSignDigits + intPartLen;
  }
  const formattedNo = new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: maxSignDigits,
  }).format(amountNo);
  return formattedNo.replaceAll(',', ' ');
}
