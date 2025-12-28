export function formatPrice(price: string | number, unit?: string): string {
    if (!price) return 'Consultar';
    
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.-]/g, '')) : price;
    
    if (isNaN(numPrice)) return 'Consultar';
    
    if (unit === 'UF') {
        return `UF ${numPrice.toLocaleString('es-CL')}`;
    }
    
    if (unit === 'USD' || unit === '$') {
        return `USD ${numPrice.toLocaleString('en-US')}`;
    }
    
    return `$ ${numPrice.toLocaleString('es-CL')}`;
}

export function formatSize(size: string | number): string {
    if (!size) return '';
    const sizeStr = String(size);
    if (sizeStr.includes('m²') || sizeStr.includes('m2')) {
        return sizeStr.replace('m2', 'm²');
    }
    return `${sizeStr}m²`;
}
