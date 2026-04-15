export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
}

export function calcInstallment(price: number, months: number = 12): number {
    return Math.ceil(price / months);
}

// Kredit narxini hisoblash: naqd narx + foiz ustama
export function calcCreditPrice(price: number, markupPercent: number = 0): number {
    return Math.ceil(price * (1 + markupPercent / 100));
}
