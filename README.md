# <img src="public/icons/icon_48.png" width="45" align="left">

AI にツイートの続きを書かせるやつ

# 使い方

1. Firebase functions にデプロイしてください。その際 API_KEY などはご自身で設定してください。
2. contentScript の API 先を 1 の URL に変更してください。
3. `npm run build` をして、build ディレクトリを chrome 拡張の設定画面でインストールしてください・
4. Twitter でツイート画面でリロードするとボタンがでます。（画面遷移で出たり出なかったりはご愛嬌）
