export const t = {
  zh: {
    // Sidebar
    newChat: '新对话',
    meetings: '会议',
    integrations: '集成',
    settings: '设置',

    // BrainChat
    syncToCRM: '同步到 CRM',
    sendMessage: '发送',
    inputPlaceholder: '向 Brain 发送消息...',
    meetingCardDate: '2026-06-10 14:00',
    aiGreeting: '你好！今天的会议「Q3 Business Review — Acme Corp」已转写完成，需要我帮你把会议内容同步到 CRM 吗？',
    userTrigger: '帮我同步到 Salesforce',
    aiReply: '好的，我来帮你生成 CRM 字段内容并同步到 Salesforce，点击下方按钮开始。',
    aiReplyGeneric: '收到！有什么其他需要帮忙的？',
    startSync: '开始同步到 CRM',
    aiReplyChat: '好的，我来帮你生成 CRM 字段内容并同步，点击下方按钮开始。',

    // OAuthModal
    connectCRM: '连接你的 CRM',
    connectDesc: '选择要同步的 CRM，完成授权后 Brain 即可自动同步会议内容。',
    cancel: '取消',
    connect: '连接',
    redirecting: '正在跳转授权页面...',
    sfDesc: 'Opportunity · Event · Task',
    hsDesc: 'Deal · Task',

    // DealMatch
    stepDeal: '匹配',
    aiFoundDeals: 'AI 根据会议参与者找到以下相关',
    createNewDeal: '新建',
    dealName: '名称',
    company: '公司',
    amount: '预计金额',
    cancelBtn: '取消',
    createAndContinue: '创建并继续',
    continueWith: '使用此',
    continue: '继续 →',
    matchBadge: '% 匹配',

    // PropertyReview / PropertyCard
    stepReview: '审核 AI 生成内容',
    newFieldAlert: 'Salesforce 新增了 2 个字段：',
    addFields: '添加',
    ignore: '忽略',
    fieldCount: '字段',
    originalValue: '原值',
    clickToEdit: '点击输入...',
    append: '追加',
    overwrite: '覆盖',

    // Event (formerly Activity)
    syncEvent: '是否同步 Event',
    syncEventDesc: '会议结束后同步至 Salesforce Event 记录',
    hasLinkedDesc: (n) => `该 Opportunity 下已有 ${n} 个关联 Event，选择要更新的：`,
    noLinkedDesc: '该 Opportunity 下暂无关联 Event：',
    searchOther: '🔍 搜索其他 Event',
    createNew: '＋ 新建 Event',
    searchPlaceholder: '搜索 CRM 中的 Event...',
    willLinkTo: '将关联到：',
    aiPrefilled: 'AI 已预填',
    activityTitle: '标题',
    activityType: '类型',
    activityDate: '日期',
    activityDesc: '描述',
    autoLink: (name) => `创建后将自动关联到：${name}`,
    demoSwitchTo: (has) => has ? '切换为：无关联 Event' : '切换为：有关联 Event',

    // Task
    taskSection: '待办事项',
    taskFrom: 'AI 从会议 Next Steps 中提取',
    taskAddManual: '+ 手动添加',
    taskPlaceholder: '输入待办事项...',
    taskDueDate: '截止日期',
    taskDeleteConfirm: '删除',

    // Sync button
    back: '返回',
    syncBtn: (n, crm) => `同步到 ${crm} →`,

    // SyncResult
    syncDone: '同步完成',
    syncedTo: '已成功同步到',
    viewInCRM: '在',
    viewInCRMSuffix: '中查看',
    backToBrain: '返回 Brain ←',
    activityCreated: '已创建',
    appendedNote: '已追加',

    // Settings
    settingsDesc: 'Workspace 级别配置，由 Admin/Owner 管理',
    crmConnection: 'CRM 连接',
    connected: '已连接',
    propertySyncConfig: 'Property 同步配置',
    propertyList: 'Property 列表',
    promptSet: '已设置 Prompt ✓',
    promptAdd: '+ Prompt',
    promptPlaceholder: '描述此字段的生成要求，不填则 AI 按字段名自动理解...',
    promptHint: '留空时 AI 会根据字段名和类型自动生成内容',
    saveSettings: '保存设置',
    refreshFields: '刷新字段',
    refreshing: '获取中...',
    refreshDone: '已更新',
  },
  ja: {
    // Sidebar
    newChat: '新規チャット',
    meetings: 'ミーティング',
    integrations: '連携',
    settings: '設定',

    // BrainChat
    syncToCRM: 'CRM に同期',
    sendMessage: '送信',
    inputPlaceholder: 'Brain にメッセージを送信...',
    meetingCardDate: '2026-06-10 14:00',
    aiGreeting: 'こんにちは！本日のミーティング「Q3 Business Review — Acme Corp」の文字起こしが完了しました。ミーティング内容を CRM に同期しますか？',
    userTrigger: 'Salesforce に同期して',
    aiReply: 'かしこまりました。CRM フィールドの内容を生成して Salesforce に同期します。下のボタンから開始してください。',
    aiReplyGeneric: '承知しました！他にお手伝いできることはありますか？',
    startSync: 'CRM への同期を開始',
    aiReplyChat: 'かしこまりました。CRM フィールドの内容を生成して同期します。下のボタンから開始してください。',

    // OAuthModal
    connectCRM: 'CRM を連携する',
    connectDesc: '同期先の CRM を選択し、認証を完了すると Brain が自動的にミーティング内容を同期できます。',
    cancel: 'キャンセル',
    connect: '連携する',
    redirecting: '認証ページへ遷移中...',
    sfDesc: 'Opportunity · Event · Task',
    hsDesc: 'Deal · Task',

    // DealMatch
    stepDeal: 'マッチング',
    aiFoundDeals: 'AI が会議参加者をもとに関連する',
    createNewDeal: '新規作成',
    dealName: '名称',
    company: '会社名',
    amount: '予想金額',
    cancelBtn: 'キャンセル',
    createAndContinue: '作成して続ける',
    continueWith: 'この',
    continue: 'で続ける →',
    matchBadge: '% 一致',

    // PropertyReview / PropertyCard
    stepReview: 'AI 生成内容を確認',
    newFieldAlert: 'Salesforce に新しいフィールドが 2 件追加されました：',
    addFields: '追加',
    ignore: '無視',
    fieldCount: 'フィールド',
    originalValue: '現在値',
    clickToEdit: 'クリックして入力...',
    append: '追記',
    overwrite: '上書き',

    // Event
    syncEvent: 'Event を同期する',
    syncEventDesc: '会議終了後に Salesforce Event レコードへ同期',
    hasLinkedDesc: (n) => `この Opportunity には ${n} 件の関連 Event があります。更新するものを選択：`,
    noLinkedDesc: 'この Opportunity には関連 Event がありません：',
    searchOther: '🔍 他の Event を検索',
    createNew: '＋ 新規 Event',
    searchPlaceholder: 'CRM の Event を検索...',
    willLinkTo: '関連付け先：',
    aiPrefilled: 'AI が事前入力済み',
    activityTitle: 'タイトル',
    activityType: '種類',
    activityDate: '日付',
    activityDesc: '説明',
    autoLink: (name) => `作成後、自動的に関連付けられます：${name}`,
    demoSwitchTo: (has) => has ? '切替：関連 Event なし' : '切替：関連 Event あり',

    // Task
    taskSection: 'タスク',
    taskFrom: 'AI が会議の Next Steps から抽出',
    taskAddManual: '+ 手動追加',
    taskPlaceholder: 'タスクを入力...',
    taskDueDate: '期限',
    taskDeleteConfirm: '削除',

    // Sync button
    back: '戻る',
    syncBtn: (n, crm) => `${crm} に同期 →`,

    // SyncResult
    syncDone: '同期完了',
    syncedTo: '正常に同期されました',
    viewInCRM: '',
    viewInCRMSuffix: 'で確認する',
    backToBrain: 'Brain に戻る ←',
    activityCreated: '作成済み',
    appendedNote: '追記済み',

    // Settings
    settingsDesc: 'Workspace レベルの設定。Admin/Owner が管理します',
    crmConnection: 'CRM 連携',
    connected: '連携済み',
    propertySyncConfig: 'プロパティ同期設定',
    propertyList: 'プロパティリスト',
    promptSet: 'Prompt 設定済み ✓',
    promptAdd: '+ Prompt',
    promptPlaceholder: 'このフィールドの生成要件を記入。空白の場合は AI がフィールド名から自動生成...',
    promptHint: '空白の場合、AI はフィールド名と型から自動的に内容を生成します',
    saveSettings: '設定を保存',
    refreshFields: 'フィールドを更新',
    refreshing: '取得中...',
    refreshDone: '更新済み',
  },
}
