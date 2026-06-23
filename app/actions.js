'use server'
import fs from 'fs';
import path from 'path';

export async function submitLocation(formData) {
    const newData = {
        id: Date.now(),
        name: formData.get('name'),
        address: formData.get('address'),
        price: formData.get('price'),
        status: 'NEEDS_ADMIN_APPROVAL',
        latitude: null, // You will run your normalizer script later to fill this
        longitude: null
    };

    const filePath = path.join(process.cwd(), 'public', 'ready_for_review.json');
    
    // Read current data, append, and save
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    fileData.push(newData);
    const { data, error } = await supabase
    .from('notary_locations')
    .insert([{ 
        name: formData.get('name'), 
        address: formData.get('address'),
        status: 'PENDING' 
    }]);
    
    return { success: true };
}