# 開発ガイドライン

## 実装・テストルール

### 1. Issue Driven Development
すべての変更は必ずIssueから開始してください。

1. **Issue作成**
   - 明確なタイトルと説明を記載
   - 受け入れ条件（Acceptance Criteria）を明記
   - 適切なラベルを付与

2. **Feature Branch作成**
   ```bash
   git checkout -b feature/issue-number-description
   # 例: git checkout -b feature/36-improve-development-process
   ```

### 2. 実装フロー

1. **ローカル開発**
   ```bash
   # 依存関係インストール（初回のみ）
   npm install

   # 開発サーバー起動
   npm start

   # Lintチェック
   npm run lint

   # Lint自動修正
   npm run lint:fix
   ```

2. **コミット前チェック**
   - Pre-commit hookが自動的にESLintを実行
   - エラーがある場合はコミットが阻止される

3. **Pull Request作成**
   - mainブランチに対してPRを作成
   - IssueをPRに紐づけ（`Closes #36`など）
   - PR作成時に自動的にCI/CDが実行される

### 3. レビュー・マージプロセス

1. **PR Check**
   - ESLint
   - テスト実行
   - ビルド確認

2. **レビュー**
   - コードレビューを実施
   - 必要に応じて修正依頼

3. **マージ**
   - すべてのチェックが通過後にマージ
   - マージ後、自動的にgh-pagesにデプロイ

4. **デプロイ確認**
   - GitHub Actionsの実行結果を確認
   - https://gghatano.github.io/blackjack-template で動作確認

### 4. 問題発生時の対応

- **デプロイ失敗**: 実装からやり直し
- **本番環境で問題発見**: 即座にrollback、修正版を作成

## コーディング規則

### ESLint設定
- `react-app`の設定を継承
- 未使用変数は警告
- console.logは本番環境では除去

### コミットメッセージ規則
```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント更新
- `style`: コードスタイル修正
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: その他の作業

**例:**
```
feat: サンプルデータ選択機能を追加

Fixes #16

- ラジオボタンでデータソース選択
- 3つのサンプルデータセットを追加
- 目標スコアの自動設定機能
```

## 開発環境セットアップ

### 必要なツール
- Node.js 18+
- npm
- Git
- VS Code（推奨）

### 初回セットアップ
```bash
# リポジトリクローン
git clone https://github.com/gghatano/blackjack-template.git
cd blackjack-template

# 依存関係インストール
npm install

# Huskyセットアップ
npm run prepare

# 開発サーバー起動
npm start
```

### VS Code設定
`.vscode/settings.json`にプロジェクト固有の設定が含まれています。
推奨拡張機能は`.vscode/extensions.json`に記載されています。

## トラブルシューティング

### ESLintエラー
```bash
# エラー確認
npm run lint

# 自動修正
npm run lint:fix
```

### Pre-commit hook無効化（緊急時のみ）
```bash
git commit --no-verify -m "emergency fix"
```

### ローカル環境のリセット
```bash
rm -rf node_modules package-lock.json
npm install
```
