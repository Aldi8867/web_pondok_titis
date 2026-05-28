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
app.use(express.json());

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
            id, name, email, role, phone, created_at,
            rooms ( id, room_number, location, floor, type )
        `);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
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
            rooms ( id, room_number )
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
