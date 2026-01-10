# Dual Import: https://marutto.co.jp/water-sakutto/

## フォルダ構成

```
├── index.html          # メインHTMLファイル
├── style.css           # スタイルシート
├── sections.json       # セクション情報（Claude Code編集用）
├── README.md           # このファイル
└── images/
    ├── desktop/        # デスクトップ用画像
    │   └── section-{n}-desktop.{ext}
    └── mobile/         # モバイル用画像
        └── section-{n}-mobile.{ext}
```

## Claude Codeでの編集

`sections.json` にはクリック可能エリア（ボタン）の情報が含まれています。

### クリック可能エリアの形式

```json
{
  "x": 0.1,           // 左端からの相対位置 (0-1)
  "y": 0.2,           // 上端からの相対位置 (0-1)
  "width": 0.3,       // 幅の相対サイズ (0-1)
  "height": 0.1,      // 高さの相対サイズ (0-1)
  "actionType": "url", // アクションタイプ: url, email, phone, scroll, form-input
  "actionValue": "https://example.com", // アクション値
  "label": "今すぐ申し込む" // ボタンラベル
}
```

### アクションタイプ

- `url`: 外部リンク
- `email`: メール送信 (mailto:)
- `phone`: 電話発信 (tel:)
- `scroll`: ページ内スクロール (#anchor)
- `form-input`: フォーム入力モーダル表示

エクスポート日時: 2026-01-09T07:18:33.428Z
