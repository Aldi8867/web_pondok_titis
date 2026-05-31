require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running!' });
});

// --- AUTH ENDPOINTS ---
app.post('/api/register', async (req, res) => {
    const { email, password, name, role } = req.body;
    if (!supabase) return res.status(500).json({ error: 'Database not connected' });

    const { data, error } = await supabase
        .from('users')
        .insert([{ email, password, name, role: role || 'user' }])
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!supabase) return res.status(500).json({ error: 'Database not connected' });

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

    if (error || !data) return res.status(401).json({ error: 'Invalid email or password' });
    res.json(data);
});

app.put('/api/users/:id/reset-password', async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!supabase) return res.status(500).json({ error: 'Database not connected' });

    const { data, error } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
});

// --- ROOMS ENDPOINTS ---
app.get('/api/rooms', async (req, res) => {
    if (!supabase) return res.status(500).json({ error: 'Database not connected' });
    const { data, error } = await supabase.from('rooms').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.post('/api/rooms', async (req, res) => {
    const { room_number, type, floor, price, description, status, name, location, image, facilities, size, rating } = req.body;
    const { data, error } = await supabase
        .from('rooms')
        .insert([{ 
            room_number, type, floor, price, description, 
            status: status || 'Tersedia',
            name: name || 'Kamar',
            location: location || 'bandung',
            image: image || '',
            facilities: facilities || [],
            size: size || '3x3 meter',
            rating: rating || 4.8
        }])
        .select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
});

app.put('/api/rooms/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
        .from('rooms')
        .update(updates)
        .eq('id', id)
        .select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
});

app.get('/api/users', async (req, res) => {
    // Digunakan oleh admin untuk melihat penyewa kamar (Tenant Data)
    const { data, error } = await supabase
        .from('users')
        .select(`
            id, name, email, role, created_at, phone, emergency_phone, origin, job,
            rooms ( id, room_number, location, floor, type )
        `);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phone, emergency_phone, origin, job } = req.body;
    if (!supabase) return res.status(500).json({ error: 'Database not connected' });

    const { data, error } = await supabase
        .from('users')
        .update({ name, phone, emergency_phone, origin, job })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
});

app.delete('/api/rooms/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Room deleted successfully' });
});

// --- WATCHLIST ENDPOINTS ---
app.get('/api/watchlist/:userId', async (req, res) => {
    const { userId } = req.params;
    const { data, error } = await supabase
        .from('watchlist')
        .select(`
            id,
            rooms ( id, room_number, type, floor, price, status, description )
        `)
        .eq('user_id', userId);
    
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.post('/api/watchlist', async (req, res) => {
    const { user_id, room_id } = req.body;
    const { data, error } = await supabase
        .from('watchlist')
        .insert([{ user_id, room_id }])
        .select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
});

app.delete('/api/watchlist/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('watchlist').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Watchlist item deleted' });
});

// --- PAYMENTS ENDPOINTS ---
app.get('/api/payments', async (req, res) => {
    const { data, error } = await supabase
        .from('payments')
        .select(`
            id, amount, status, proof_image, created_at,
            users ( id, name, email ),
            rooms ( id, room_number, type, location, floor )
        `);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.post('/api/payments', async (req, res) => {
    const { user_id, room_id, amount, proof_image } = req.body;
    const { data, error } = await supabase
        .from('payments')
        .insert([{ user_id, room_id, amount, proof_image }])
        .select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
});

app.put('/api/payments/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    const { data, error } = await supabase
        .from('payments')
        .update({ status })
        .eq('id', id)
        .select();
        
    if (error) return res.status(400).json({ error: error.message });
    
    if (status === 'approved' && data && data.length > 0) {
        // Link room to user
        await supabase.from('rooms').update({ 
            user_id: data[0].user_id, 
            status: 'Terisi' 
        }).eq('id', data[0].room_id);
    } else if (status === 'rejected' && data && data.length > 0) {
        // Bebaskan kamar jika ditolak
        await supabase.from('rooms').update({ 
            user_id: null, 
            status: 'Tersedia' 
        }).eq('id', data[0].room_id);
    }
    
    res.json(data[0]);
});

app.put('/api/rooms/:id/evict', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('rooms')
        .update({ user_id: null, status: 'Tersedia' })
        .eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Tenant evicted successfully' });
});

app.get('/api/payments/user/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.post('/api/users/:id/kick', async (req, res) => {
    const { id } = req.params;
    if (!supabase) return res.status(500).json({ error: 'Database not connected' });
    
    // Bebaskan semua kamar yang dimiliki user ini
    await supabase.from('rooms').update({ 
        user_id: null, 
        status: 'Tersedia' 
    }).eq('user_id', id);
    
    // Ubah status payment aktif menjadi expired agar tidak terhitung lagi
    await supabase.from('payments').update({
        status: 'expired'
    }).eq('user_id', id).eq('status', 'approved');

    res.json({ message: 'User kicked and rooms freed successfully' });
});

// --- RESET DATA ENDPOINT (DANGER) ---
app.post('/api/reset-data', async (req, res) => {
    if (!supabase) return res.status(500).json({ error: 'Database not connected' });
    
    try {
        // 1. Set all rooms to 'Tersedia' and remove user_id
        await supabase.from('rooms').update({ user_id: null, status: 'Tersedia' }).neq('id', '00000000-0000-0000-0000-000000000000');
        
        // 2. Clear all payments
        await supabase.from('payments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        
        // 3. Clear all watchlists
        await supabase.from('watchlist').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        
        res.json({ message: 'Data reset successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SETTINGS ENDPOINTS ---
const defaultSettings = {
    bandung: {
        name: "Pondok Titis Bandung",
        phone: "6285128067691",
        address: "Jl. Jayasari No. 34, Bojongsoang, Bandung",
        mapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247.51933210456357!2d107.63509847442991!3d-6.972787051880548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e9b23c875a71%3A0x620136e5d548749d!2sPondok%20Titis%20%26%20GG%20Jayasari!5e0!3m2!1sid!2sid!4v1779553864533!5m2!1sid!2sid",
        mapsLink: "https://www.google.com/maps/place/Pondok+Titis+%26+GG+Jayasari/@-6.9727871,107.6350985,19z/"
    },
    solo: {
        name: "Pondok Titis Solo",
        phone: "628987654321",
        address: "Ketinggilan, Jebres, Surakarta, Jawa Tengah",
        mapsIframe: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d63286.67148769744!2d110.8454407!3d-7.5294174!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a171bdccf99a5%3A0x305730521ef5cc80!2sPONDOK%20%22TITIS%22!5e0!3m2!1sid!2sid!4v1779553889627!5m2!1sid!2sid",
        mapsLink: "https://www.google.com/maps/place/PONDOK+%22TITIS%22/@-7.5294174,110.8454407,17z/"
    }
};

let inMemorySettings = { ...defaultSettings };

app.get('/api/settings', async (req, res) => {
    if (supabase) {
        try {
            const { data, error } = await supabase.from('settings').select('*');
            if (!error && data && data.length > 0) {
                const configRow = data.find(row => row.key === 'config');
                if (configRow) {
                    return res.json(configRow.value);
                }
            }
        } catch (err) {
            console.error("Supabase settings query error, falling back to in-memory:", err);
        }
    }
    res.json(inMemorySettings);
});

app.post('/api/settings', async (req, res) => {
    const newSettings = req.body;
    inMemorySettings = newSettings;
    
    if (supabase) {
        try {
            const { data: existing } = await supabase.from('settings').select('*').eq('key', 'config');
            let result;
            if (existing && existing.length > 0) {
                result = await supabase.from('settings').update({ value: newSettings }).eq('key', 'config').select();
            } else {
                result = await supabase.from('settings').insert([{ key: 'config', value: newSettings }]).select();
            }
            if (!result.error && result.data && result.data.length > 0) {
                return res.json(result.data[0].value);
            }
        } catch (err) {
            console.error("Failed to save settings to Supabase, saved to memory:", err);
        }
    }
    res.json(inMemorySettings);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
