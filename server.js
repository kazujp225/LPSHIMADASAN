import express from 'express';
import { Resend } from 'resend';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// JSONパーサー
app.use(express.json());

// 静的ファイル配信
app.use(express.static(__dirname));

// メール送信API
app.post('/api/send-email', async (req, res) => {
    try {
        const {
            subject,
            inquiryType,
            name,
            furigana,
            email,
            phone,
            zipcode,
            prefecture,
            city,
            address,
            remarks,
            preferredTime
        } = req.body;

        // メール本文をHTML形式で作成
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #0088cc; border-bottom: 2px solid #0088cc; padding-bottom: 10px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 10px; background: #f5f5f5; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Filtia お問い合わせフォーム</h1>

        <div class="field">
            <div class="label">お問い合わせ区分</div>
            <div class="value">${inquiryType}</div>
        </div>

        <div class="field">
            <div class="label">お名前</div>
            <div class="value">${name}</div>
        </div>

        <div class="field">
            <div class="label">フリガナ</div>
            <div class="value">${furigana}</div>
        </div>

        <div class="field">
            <div class="label">メールアドレス</div>
            <div class="value">${email}</div>
        </div>

        <div class="field">
            <div class="label">電話番号</div>
            <div class="value">${phone}</div>
        </div>

        ${zipcode || prefecture || city || address ? `
        <div class="field">
            <div class="label">住所</div>
            <div class="value">
                ${zipcode ? `〒${zipcode}<br>` : ''}
                ${prefecture}${city}${address}
            </div>
        </div>
        ` : ''}

        ${remarks ? `
        <div class="field">
            <div class="label">備考</div>
            <div class="value">${remarks.replace(/\n/g, '<br>')}</div>
        </div>
        ` : ''}

        <div class="field">
            <div class="label">電話連絡ご希望時間帯</div>
            <div class="value">${preferredTime || '指定なし'}</div>
        </div>
    </div>
</body>
</html>
        `;

        // Resendでメール送信
        if (!resend) {
            // 開発環境：APIキーがない場合はログ出力のみ
            console.log('=== 開発モード：メール送信シミュレーション ===');
            console.log('送信先:', 'contact@filtia.net');
            console.log('件名:', subject);
            console.log('送信データ:', { inquiryType, name, furigana, email, phone, preferredTime });
            return res.status(200).json({ success: true, id: 'dev-mode' });
        }

        const { data, error } = await resend.emails.send({
            from: 'Filtia お問い合わせ <noreply@filtia.net>',
            to: ['contact@filtia.net'],
            subject: subject,
            html: htmlContent,
            replyTo: email
        });

        if (error) {
            console.error('Resend error:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }

        return res.status(200).json({ success: true, id: data.id });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// index.htmlへのフォールバック
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
