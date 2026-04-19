import crypto from 'crypto';

export async function uploadToCloudinary(base64Image: string): Promise<string> {
    // Agar tayyor URL bo'lsa (data: emas), shunchaki o'zini qaytaramiz
    if (!base64Image || base64Image.startsWith('http://') || base64Image.startsWith('https://')) {
        return base64Image;
    }

    const url = process.env.CLOUDINARY_URL;
    let cloudName = 'dx43v9qso';
    let apiKey = '778368352334379';
    let apiSecret = '';

    if (url && url.startsWith('cloudinary://')) {
        // URL formati: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
        const matches = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
        if (matches) {
            apiKey = matches[1];
            apiSecret = matches[2];
            cloudName = matches[3];
        }
    }
    
    // Yulduzchali yoki bo'sh API secret
    if (!apiSecret || apiSecret.includes('*')) {
        console.error('Cloudinary API Secret topilmadi. .env faylida Cloudinary URL ni tekshiring.');
        return base64Image;
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signatureString = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    const formData = new FormData();
    formData.append('file', base64Image);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });
        
        const data = await res.json();
        if (data.secure_url) {
            return data.secure_url;
        }
        console.error('Cloudinary yuklash xatosi:', data);
        return base64Image;
    } catch (e) {
        console.error('Cloudinary bilan boglanishda xatolik:', e);
        return base64Image;
    }
}
