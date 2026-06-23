import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = createClient()
    const now = new Date()
    
    const { data: tugasList, error } = await supabase
        .from('tugas')
        .select('*')
        .eq('status', 'aktif')
        .eq('notifikasi_aktif', true)
        .not('telegram_chat_id', 'is', null)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const notifTerkirim: string[] = []

    for (const tugas of tugasList) {
        const deadline = new Date(tugas.deadline)
        const selisihJam = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60)
        
        let tipeNotif = ''
        
        if (selisihJam <= 3 && selisihJam > 0) {
            tipeNotif = '3jam'
        } else if (selisihJam <= 24 && selisihJam > 3) {
            tipeNotif = 'H-1'
        } else if (selisihJam <= 72 && selisihJam > 24) {
            tipeNotif = 'H-3'
        }
        
        if (tipeNotif && tugas.telegram_chat_id) {
            await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: tugas.telegram_chat_id,
                    text: `📌 *${tipeNotif}* Deadline!\n\n📋 *${tugas.judul}*\n📝 ${tugas.deskripsi || '-'}\n⏰ Deadline: ${deadline.toLocaleString('id-ID')}\n📂 Kategori: ${tugas.kategori}\n\n⚠️ Segera selesaikan tugasmu!`
                })
            })
            
            notifTerkirim.push(`${tugas.judul} - ${tipeNotif}`)
            
            await supabase.from('notifikasi_log').insert({
                tugas_id: tugas.id,
                tipe: tipeNotif
            })
        }
    }

    return NextResponse.json({
        message: 'Notifikasi test berhasil',
        terkirim: notifTerkirim,
        total: notifTerkirim.length
    })
}