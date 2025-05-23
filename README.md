# Word-BlackJack

https://gghatano.github.io/blackjack-template/

参加者が単語を選んだら、それに紐づくスコアを獲得し、基準値に近づけるゲームです。

例えば、イベント会場(東京ドーム/横浜アリーナ/etc...)のリストから1つ選ぶと、収容人数の数字が得点に加算されます。
参加者が順番に選択して、合計が90000点を超えたらドボン、90000点に最も近づけた人が勝ち、というゲームです。

[参考](https://www.youtube.com/watch?v=a_21uIXDWIE)

単語と数字のリスト(データ)をGoogle Spreadsheetに用意して、URLを入力すれば、オリジナルのブラックジャックで遊べます。

## ゲームの進め方

- Google SpreadsheetのA列に単語名、B列に数値を配置します。20個くらい、ある程度数値のばらつきがあるとよいです
- [リンク先](https://gghatano.github.io/blackjack-template/)の画面で、参加するチーム数とデータのURLを入力します
- 参加者は、順番に、開示された単語名のリストから１つを選択します。選択した単語に隠された数値を得点として獲得します。
- 参加者は順番に単語名を宣言して、得点を基準値に近づけます。基準値を超えたら失格（負け）となります。
- 最後に残っている1チームが勝者です

## 開発用のメモ

### ローカルサーバでの起動
```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start
```
ブラウザで http://localhost:3000 にアクセスすると遊べます

### GitHub Pagesへのデプロイ

```bash
# ビルドとデプロイ
npm run deploy
```

### データの準備

ゲームでは、Google Spreadsheetのデータを使用します。
スプレッドシートは以下の形式で準備してください：

- A列: 単語名（例：会場名、都市名など）
- B列: 数値（例：収容人数、人口など）

デフォルトのスプレッドシートURL:
`https://docs.google.com/spreadsheets/d/1Y-gSB3luEaQ8YVCWtBIxZ-xdAurTzlpDuwQ3Y7pRjww/edit?gid=0#gid=0`

## 機能
1. 初期画面
   - チーム数とチーム名の入力
   - データURLの入力（カスタムデータの使用が可能）

2. ゲーム画面
   - 左側: ゲーム進行エリア
     - 基準点の表示と設定
     - 各チームの得点表示
     - ゲーム履歴表示
   - 右側: 単語リスト
     - 選択可能な単語一覧
     - 使用済み単語のグレーアウト表示

## ライセンス

## 謝辞
蓮見水族館さんありがとうございます
