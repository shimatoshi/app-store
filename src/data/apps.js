export const apps = [
  {
    id: 'weather-pwa',
    name: 'お天気アプリ',
    category: 'PWA',
    description: 'リアルタイムの天気予報を確認できるPWAアプリです。',
    installSteps: [
      'ブラウザでアプリを開く',
      'メニューから「ホーム画面に追加」を選択',
      'ホーム画面から起動できるようになります'
    ],
    link: 'https://weather-app-example.com',
    icon: '🌤️',
    rating: 4.8
  },
  {
    id: 'termux-tool',
    name: 'Termux 開発ツール',
    category: 'Termux',
    description: 'Termux環境を自動でセットアップするスクリプト群です。',
    installSteps: [
      'Termuxを開く',
      'コマンド `curl -sL https://example.com/setup.sh | bash` を実行',
      '指示に従ってインストールを完了させる'
    ],
    link: 'https://github.com/example/termux-tool',
    icon: '💻',
    rating: 4.5
  },
  {
    id: 'task-manager-pwa',
    name: 'タスク管理',
    category: 'PWA',
    description: 'シンプルで使いやすいタスク管理アプリです。オフラインでも動作します。',
    installSteps: [
      'ブラウザでアプリを開く',
      'メニューから「ホーム画面に追加」を選択',
      'ホーム画面から起動できるようになります'
    ],
    link: 'https://task-manager-example.com',
    icon: '✅',
    rating: 4.7
  },
  {
    id: 'python-runner-termux',
    name: 'Python 実行環境',
    category: 'Termux',
    description: 'Termux上でPythonスクリプトを簡単に実行するためのツールです。',
    installSteps: [
      'Termuxを開く',
      'コマンド `pkg install python` を実行',
      'スクリプトをダウンロードして実行'
    ],
    link: 'https://github.com/example/python-runner',
    icon: '🐍',
    rating: 4.9
  },
  {
    id: 'file-explorer-pwa',
    name: 'ファイルエクスプローラー',
    category: 'PWA',
    description: 'ブラウザからローカルファイルを管理できるツールです。',
    installSteps: [
      'ブラウザでアプリを開く',
      'メニューから「ホーム画面に追加」を選択'
    ],
    link: 'https://file-explorer-example.com',
    icon: '📁',
    rating: 4.2
  },
  {
    id: 'neofetch-termux',
    name: 'Neofetch',
    category: 'Termux',
    description: 'システム情報を美しく表示するコマンドラインツールです。',
    installSteps: [
      'Termuxを開く',
      'コマンド `pkg install neofetch` を実行',
      'コマンド `neofetch` で実行'
    ],
    link: 'https://github.com/dylanaraps/neofetch',
    icon: '📊',
    rating: 4.9
  },
  {
    id: 'vim-setup',
    name: 'Vim 開発環境',
    category: 'Termux',
    description: 'Termuxを最強のコーディング環境に変えるVim設定済みパッケージ。',
    installSteps: [
      'Termuxを開く',
      'コマンド `pkg install vim` を実行',
      '設定ファイルをダウンロード'
    ],
    link: 'https://github.com/vim/vim',
    icon: '📝',
    rating: 4.7
  }
];
