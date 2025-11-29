export type CodesRecord = {
    oldCode: string
    newCode: string
    expires: number
}


const STORAGE_KEY = 'sms_mock_codes'


function genCode() { return Math.floor(100000 + Math.random() * 900000).toString() }


function readStore(): Record<string, CodesRecord> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch (e) { return {} }
}


function writeStore(s: Record<string, CodesRecord>) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) }


export function sendCodesMock(oldPhone: string, newPhone: string, ttl = 1000*60*5) {
    const id = `${oldPhone}:${newPhone}`
    const oldCode = genCode()
    const newCode = genCode()
    const expires = Date.now() + ttl
    const store = readStore()
    store[id] = { oldCode, newCode, expires }
    writeStore(store)
// برای توسعه: لاگ یا return کدها برای نمایش در UI
    console.log('[SMS MOCK] oldCode', oldPhone, oldCode)
    console.log('[SMS MOCK] newCode', newPhone, newCode)
    return { oldCode, newCode }
}


export function verifyCodesMock(oldPhone: string, newPhone: string, oldCode: string, newCode: string) {
    const id = `${oldPhone}:${newPhone}`
    const store = readStore()
    const rec = store[id]
    if (!rec) return { ok: false, error: 'no-codes' }
    if (Date.now() > rec.expires) { delete store[id]; writeStore(store); return { ok: false, error: 'expired' } }
    if (rec.oldCode !== oldCode || rec.newCode !== newCode) return { ok: false, error: 'invalid' }
// موفق
    delete store[id]
    writeStore(store)
    return { ok: true }
}