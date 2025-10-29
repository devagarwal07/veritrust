let BACKEND = localStorage.getItem('backendUrl') || 'http://127.0.0.1:8000';
let JWT = localStorage.getItem('jwt') || '';

function setCfg() {
    const be = document.getElementById('backendUrl').value.trim();
    const jwt = document.getElementById('jwt').value.trim();
    if (be) {
        BACKEND = be;
        localStorage.setItem('backendUrl', BACKEND);
    }
    JWT = jwt;
    localStorage.setItem('jwt', JWT);
}

function initCfg() {
    document.getElementById('backendUrl').value = BACKEND;
    document.getElementById('jwt').value = JWT;
    document.getElementById('saveCfg').addEventListener('click', setCfg);
}

async function postJson(path, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (JWT) headers['Authorization'] = JWT.startsWith('Bearer ') ? JWT : `Bearer ${JWT}`;
    const res = await fetch(`${BACKEND}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    if (!res.ok) throw data;
    return data;
}

function pretty(o) { return JSON.stringify(o, null, 2); }

function bindFace() {
    document.getElementById('btnFace').addEventListener('click', async () => {
        const body = {
            user_id: document.getElementById('face_user_id').value.trim(),
            id_image_url: document.getElementById('id_image_url').value.trim(),
            selfie_url: document.getElementById('selfie_url').value.trim(),
        };
        const out = document.getElementById('outFace');
        out.textContent = 'Loading...';
        try {
            const r = await postJson('/verify/face', body);
            out.textContent = pretty(r);
        } catch (e) {
            out.textContent = pretty(e);
        }
    });
}

function bindDoc() {
    document.getElementById('btnDoc').addEventListener('click', async () => {
        const body = {
            user_id: document.getElementById('doc_user_id').value.trim(),
            doc_url: document.getElementById('doc_url').value.trim(),
            expected_name: document.getElementById('expected_name').value.trim() || null,
        };
        const out = document.getElementById('outDoc');
        out.textContent = 'Loading...';
        try {
            const r = await postJson('/verify/document', body);
            out.textContent = pretty(r);
        } catch (e) {
            out.textContent = pretty(e);
        }
    });
}

function bindScore() {
    document.getElementById('btnScore').addEventListener('click', async () => {
        const body = {
            user_id: document.getElementById('score_user_id').value.trim(),
            kyc_valid: document.getElementById('kyc_valid').checked,
            income: Number(document.getElementById('income').value),
            transactions_per_week: Number(document.getElementById('tx_per_week').value),
            fraud_flags: Number(document.getElementById('fraud_flags').value),
            trust_score: Number(document.getElementById('trust_score').value),
        };
        const out = document.getElementById('outScore');
        out.textContent = 'Loading...';
        try {
            const r = await postJson('/score/credit', body);
            out.textContent = pretty(r);
        } catch (e) {
            out.textContent = pretty(e);
        }
    });
}

function bindFraud() {
    document.getElementById('btnFraud').addEventListener('click', async () => {
        const body = {
            user_id: document.getElementById('fraud_user_id').value.trim(),
            id_hash: document.getElementById('id_hash').value.trim(),
            face_hash: document.getElementById('face_hash').value.trim(),
        };
        const out = document.getElementById('outFraud');
        out.textContent = 'Loading...';
        try {
            const r = await postJson('/fraud/check', body);
            out.textContent = pretty(r);
        } catch (e) {
            out.textContent = pretty(e);
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initCfg();
    bindFace();
    bindDoc();
    bindScore();
    bindFraud();
});
