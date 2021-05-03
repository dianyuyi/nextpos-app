const zh = {
  login: '登入',
  clientName: '店名/公司名',
  email: '電子郵件',
  passcode: '六位數代碼',
  password: '密碼',
  confirmPassword: '確認密碼',
  logout: '登出',
  changeUser: '切換使用者',
  refreshed: '已重新刷新',
  privilegedAccessTitle: '這是進階功能',
  premiumFeatureMsg: '是否前往訂閱',
  greeting: '您好',
  deletedBy: '操作者',
  noWorkingArea: '無指定工作區',
  allSelected: '全選',
  selectWorkingArea: '顯示工作區',
  selectCompletedOrder: '顯示已完成訂單',
  selectUnCompletedOrder: '顯示未完成訂單',
  moreAction: '操作',
  general: {
    noData: '沒有資料'
  },
  menu: {
    home: '主頁',
    tables: '座位訂單',
    orders: '訂單',
    orderDisplay: '訂單顯示',
    reservations: '訂位',
    reporting: '報表',
    settings: '設定',
    clientUsers: '使用者清單',
    timecard: '打卡'
  },
  settings: {
    account: '帳號',
    stores: '商店設定',
    products: '產品管理',
    staff: '員工',
    workingArea: '工作區/出單機',
    language: '語言',
    tableLayouts: '座位管理',
    manageShifts: '開關帳',
    announcements: '公告',
    manageOffers: '促銷管理',
    preferences: '喜好設定',
    eInvoice: '電子發票',
    subscription: '訂閱',
    roster: '排班管理',
    member: '會員管理',
    changeToStore: '切換商店版',
    changeToRetail: '切換零售版',
  },
  newItem: {
    new: '新增',
    product: '產品',
    category: '分類',
    printer: '出單機',
    workingArea: '工作區',
    productOption: '產品註記',
  },
  action: {
    ok: '好',
    done: '結束',
    enter: '輸入',
    save: '儲存',
    search: '搜尋',
    update: '更新',
    cancel: '取消',
    delete: '刪除',
    prepare: '準備完成',
    confirmMessageTitle: '執行確認',
    confirmMessage: '確定執行嗎？',
    yes: '是',
    no: '不是',
    unpin: '移除置頂',
    pin: '加入置頂',
    activate: '啟用',
    deactivate: '停用',
    submit: '送出',
    confirm: '確認',
  },
  // ==== domain specific ====
  keyboardAction: {
    clean: '清除',
    ok: '確定',
    back: '返回',
  },
  product: {
    ungrouped: '未分類',
    pinned: '置頂產品',
    newProduct: '新增產品',
    editProduct: '修改產品',
    productName: '產品名稱',
    internalProductName: '內部產品名稱',
    price: '價格',
    costPrice: '成本價',
    productLabel: '產品分類',
    description: '產品敘述',
    childProducts: '子產品',
    options: '產品選項',
    workingArea: '工作區',
    inventoryEdit: '產品庫存管理',
  },
  newOrder: {
    newOrderTitle: '新訂單',
    orderType: '訂單種類',
    table: '桌位',
    selectTable: '選擇桌位',
    noAvailableTables: '目前沒有空桌.',
    ageGroup: '來客年齡層',
    male: '男性',
    female: '女性',
    kid: '兒童',
    visitFrequency: '造訪次數',
    peopleCount: '來客數',
    openOrder: '儲存訂單'
  },
  order: {
    inStore: '內用',
    IN_STORE: '內用',
    takeOut: '外帶',
    TAKE_OUT: '外帶',

    ordersTitle: '訂單歷史',
    fromDate: '開始日期',
    toDate: '結束日期',
    orderId: '訂單號碼',
    date: '日期',
    orderStatusLong: '訂單狀態',
    orderStatus: '訂單狀態',
    noOrder: '沒有資料',

    orderDetailsTitle: '訂單內容',
    serviceCharge: '服務費',
    discount: '折扣',
    total: '總金額',
    paymentMethod: '付款方式',
    staff: '員工',
    ageGroup: '來客年齡層',
    visitedFrequency: '造訪次數',
    notFilledIn: '未填',
    orderStartDate: '開單日期',
    lineItemCreatedDate: '日期',
    preparationDuration: '備餐時間',
    endDate: '結束日期',
    duration: '共計',
    product: '產品',
    quantity: '數量',
    unitPrice: '單價',
    subtotal: '小計',
    lineState: '狀態',
    serveBy: '結帳人員',
    copiedFrom: '複製於',
    freeLineitem: '招待',
    cancelFreeLineitem: '取消招待',
    tableName: '桌號',
    activeOffer: '套用促銷',
    noActiveOffer: '暫無套用促銷',

    // order specific actions
    liveOrders: '打開即時訂單',
    copyOrder: '複製訂單',

    // order messages
    submitted: '訂單送出',
    deleted: '訂單刪除',
    copied: '複製訂單成功',
    free: '招待成功',
    cancelFree: '取消招待成功',
    mergeOrderTitle: '併桌付款',
    mergeOrderMsg: '是否執行品項合併',

    toggleOutOfStockMsg: '確認估清?',
    toggleUnmarkOutOfStockMsg: '取消估清?',
    splitBillPopUpTitle: '拆帳方式',
    splitByItem: '以品項拆帳',
    splitByHeadCount: '以人頭拆帳',
    payLeftAmount: '一次付清',
    completeOrder: '結束訂單',
    splitInvoiceDetail: '發票(狀態)'
  },
  orderState: {
    OPEN: '已開單',
    IN_PROCESS: '準備中',
    OVERDUE: '逾時',
    DELIVERED: '已送餐',
    SETTLED: '已付款',
    REFUNDED: '已退款',
    COMPLETED: '完成',
    DELETED: '刪單',
    CANCELLED: '作廢',
    OTHERS: '空桌',
    PAYMENT_IN_PROCESS: '結帳中',
  },
  orderLog: {
    title: '訂單日誌',
    updateOrder: '訂單資訊更新',
    updateMembership: '會員綁定',
    stateChange: '訂單狀態改變',
    addOrderLineItem: '品項新增',
    updateOrderLineItem: '品項更新',
    deleteOrderLineItem: '品項刪除',
    deliverLineItems: '品項送出',
    waiveServiceCharge: '服務費折免',
    applyOrderDiscount: '訂單折扣',
    removeOrderDiscount: '訂單折扣移除',
    copyOrder: '訂單複製',
    deleteOrder: '訂單刪除',
    prepareLineItems: '品項製作完成',
    updateOrderLineItemPrice: '品項招待',
    quickCheckout: '快速結帳',
    moveOrder: '併桌',
  },
  invoiceStatus: {
    invoiceStatus: '發票狀態',
    CREATED: '開立',
    MIG_CREATED: '準備上傳',
    PROCESSED: '開立成功',
    CANCELLED: '作廢成功',
    VOID: '註銷成功',
    cancelInvoice: '發票作廢',
    noSetting: '未設定',
  },
  payment: {
    cashPayment: '現金',
    cardPayment: '信用卡',
    paymentTitle: '付款',
    orderOptions: '訂單選項',
    waiveServiceCharge: '折抵服務費',
    resetAllOffers: '取消訂單優惠',
    payOrder: '付帳',
    paid: '實收',
    change: '找零',
    remainder: '剩餘',
    CardNo: '卡號末四碼',
    cardType: '信用卡種類',
    taxIDNumber: '統一編號',
    enterTaxIDNumber: '輸入統一編號',
    ok: '確定',
    cancel: '取消',
    charged: '付款成功',
    discountOptions: '折扣選項',
    checkTaxIDNumber: '請輸入正確的統一編號',
    checkAutoComplete: '輸入的現金金額小於訂單總金額，請問您想要自動補差額嗎？',
    checkCarrierId: '格式錯誤，請重新掃描',
    carrierId: '載具',
    npoBan: '愛心碼',
    checkPrintInvoice: '是否要列印電子發票'
  },
  timecard: {
    hours: '小時',
    minutes: '分鐘'
  },
  shift: {
    closeShift: '關帳',
    status: {
      INACTIVE: '未開帳',
      ACTIVE: '開帳中',
      CLOSING: '關帳中',
      CONFIRM_CLOSE: '關帳確認',
      BALANCED: '已關帳',
      UNBALANCED: '關帳金額異常'
    },
    shiftDetailsTitle: '帳內容',
    staff: '員工',
    shiftSummary: '關帳總覽',
    totalCashIncome: '現金營業額',
    totalCreditCardIncome: '刷卡營業額',
    totalClosingAmount: '總營業額',
    invoicesTitle: '訂單總覽',
    totalInvoices: '訂單數',
    deletedOrders: '刪單數',
    totalDiscounts: '折扣',
    totalServiceCharge: '服務費',
    closingRemark: '關帳備註',
    confirmAction: '確定關帳',
    abortAction: '取消關帳',
    accountCloseTitle: '開始關帳',
    confirmCloseTitle: '關帳確認',
    cashSection: '現金',
    cardSection: '信用卡',
    nextAction: '下一步',
    closingStatus: '關帳狀態',
    startingCash: '開帳現金',
    totalCashTransitionAmt: '現金營業額',
    totalCashInRegister: '實際現金總額',
    enterAmount: '請輸入金額',
    remark: '差異原因',
    enterRemark: '請輸入原因',
    totalCardTransitionAmt: '刷卡營業額',
    totalCardInRegister: '實際刷卡營業額',
    difference: '差額',
    deleteLineItemLog: '刪除品項紀錄',

    // messages
    shiftOpened: '已開帳',
    shiftAborted: '關帳取消',
    shiftClosed: '已關帳',
    sendEmail: '發送關帳紀錄Email',
    sendEmailDone: '信件已發送',
    printShiftReport: '列印關帳紀錄',
    printShiftReportDone: '關帳紀錄已列印',
  },
  preferences: {
    darkMode: '暗黑模式'
  },
  // ==== component specific ====
  monthPicker: {
    month: '月',
    year: '年',
    monthRange1to2: '一月 - 二月',
    monthRange3to4: '三月 - 四月',
    monthRange5to6: '五月 - 六月',
    monthRange7to8: '七月 - 八月',
    monthRange9to10: '九月 - 十月',
    monthRange11to12: '十一月 - 十二月',
    January: '一月',
    February: '二月',
    March: '三月',
    April: '四月',
    May: '五月',
    June: '六月',
    July: '七月',
    August: '八月',
    September: '九月',
    October: '十月',
    November: '十一月',
    December: '十二月',
  },
  dayPicker: {
    dayOfWeek: '星期',
    Sunday: '星期日',
    Monday: '星期一',
    Tuesday: '星期二',
    Wednesday: '星期三',
    Thursday: '星期四',
    Friday: '星期五',
    Saturday: '星期六',
  },
  datetimeRange: {
    pickerTitle: '選擇日期與時間',
    select: '確定'
  },
  errors: {
    required: '必填',
    email: 'Email欄位',
    clientPassword: '密碼需要至少六個字母，一個數字，一個大寫字母',
    confirmPassword: '請輸入相同的密碼',
    percentage: '百分比需介於1至100',
    moreThanZero: '數量至少要大於零',
    balanceError: '請輸入大於零的數字',
    loginFailed: '登入失敗',
    requireFourDigits: '請輸入四位數字',
    requireEightDigits: '請輸入八位數字',
    requireTwoUppercaseLetters: '請輸入兩個大寫英文',
    requireNDigitsNumber: '請輸入{{n}}位數字',
    expiredToken: 'Token無效或已失效',
  },
  backend: {
    POST: '儲存成功',
    PATCH: '儲存成功',
    DELETE: '刪除成功',
    403: '您未被授權執行本次動作',
    404: '您要找的項目不存在',
    message: {
      insufficientCashAmount: '輸入的現金金額小於訂單總金額',
      discountedTotalLessThanZero: '打折後的金額不能小於零',
      completeAllOrdersFirst: '請先完成所有的訂單',
      userRoleInUse: '此權限正被使用中',
      unableToChangeState: '無法更改訂單狀態',
      alreadyExists: '名稱已存在',
      categoryInUse: '此分類正在使用中',
      workingAreaInUse: '此工作區正在使用中',
      printerHasWorkingArea: '此出單機有使用中的工作區',
      optionInUse: '此註記正在使用中',
      emptyTables: '請選擇桌位',
      orderFinalized: '此訂單已被結帳，返回桌位頁面',
      passwordUsed: '密碼已被使用',
      cannotDelete: '此併桌訂單不能被刪除。請用結帳來完成訂單。',
      alreadyProcessed: '已處理的進貨單不能修改。',
      noPrinter: '結帳出單機尚未設定',
      outOfStock: '選擇的產品已無庫存'
    }
  },
  eInvoice: {
    eInvoiceStatusTitle: '電子發票',
    nowEinvoiceStatus: '目前狀態',
    rangeIdentifier: '發票期別',
    rangeFrom: '發票起號',
    rangeTo: '發票迄號',
    remainingInvoiceNumbers: '剩餘張數',
    viewAllInvoice: '管理字軌號碼',
    ubn: '統一編號',
    setUBN: '設定統一編號',
    AES_KEY: '種子密碼',
    setAES_KEY: '設定種子密碼',
    invoice: '統一發票',
    setInvoice: '設定統一發票',
    eInvoiceTitle: '電子發票號碼',
    prefixYear: '字軌年份',
    prefixMonth: '字軌月份',
    prefix: '發票字軌',
    reprintInvoice: '補印發票',
    viewCancellableInvoice: '檢視可作廢發票',
    cancelInvoice: '作廢發票',
    cancelInvoiceConfirmMsg: '確認作廢此張發票？'
  },
  roster: {
    year: '年份',
    month: '月份',
    dayOfWeek: '星期',
    startTime: '開始時間',
    endTime: '結束時間',
    createEvent: '建立行程',
    deleteEvent: '刪除行程',
    resources: '人員'
  },
  bar: 'Bar {{someValue}}',
  printerSuccess: '列印成功',
  printerWarning: '列印失敗',
  splittingCheck: '目前仍有拆帳中的訂單，確定開始新的拆帳？',
  splitBill: {
    SpiltBillScreenTitle: '拆帳',
    ConfirmCancelMessage: '確定取消拆帳嗎？',
    nothing: '尚無產品',
    parentOrder: '原單',
    splitOrder: '子單'
  },
  productOption: '產品註記',
  printWorkingOrder: '列印工作單',
  printOrderDetails: '列印明細',
  quickCheckoutPrint: '是否列印工作單?',
  orderFilterForm: {
    searchByDateAndTable: '以日期和桌位搜尋',
    searchByInvoice: '以發票號碼搜尋',
    tablePlaceholder: '請輸入桌位'
  },
  subscription: {
    submitted: '已送出',
    activated: '已生效',
    currentPlan: '當前方案',
    status: '狀態',
    select: '選擇',
    planStartDate: '開始日期',
    planEndDate: '結束日期',
    changeStatus: '修改狀態',
    action: {
      lapse: '取消訂閱',
      cancel: '取消送出'
    },
    statusCode: {
      SUBMITTED: '已送出',
      ACTIVE: '使用中',
      ACTIVE_LAPSING: '使用中(不續訂)',
      INACTIVE: '停用中',
      EXPIRED: '尚未選擇方案',
      CANCELLED: '已取消',
      ACTIVE_RENEWING: '使用中(續約中)',
      LAPSED: '已過期',
    },
    planCode: {
      FREE: '免費'
    }
  },
  calendarEvent: {
    screenTitle: '排程管理',
    month: '月',
    week: '週',
    status: {
      PLANNED: '已排程',
      ALLOCATED: '已分配',
      ATTENDED: '已完成',
      CANCELLED: '已取消'
    },
    startTime: '開始時間',
    endTime: '結束時間',
    eventResources: '工作區',
    assign: '分配',
    remove: '移除分配',
  },
  calendar: {
    monthly: '月曆',
    weekly: '周曆',
    daily: '日曆',
    roster: '排班',
    reservation: '訂位',
    showMyEvent: '顯示我的排班',
    noWorkingArea: '尚未排班'
  },
  membership: {
    searchNullMsg: '查無此人，是否註冊會員?',
    creatSuccessMsg: '註冊成功',
    bindSuccessMsg: '綁定成功',
    name: '姓名',
    phoneNumber: '聯絡電話',
    bind: '綁定會員',
    membershipAccount: '會員帳號',
    enterMembershipAccount: '請輸入會員帳號',
    newMembership: '新會員',
  },
  member: {
    searchPrompt: '以聯絡電話搜尋',
    MALE: '男',
    FEMALE: '女',
    name: '姓名',
    phoneNumber: '聯絡電話',
    gender: '性別',
    birthday: '生日',
    tags: '會員標籤',
    createMember: '新增會員',
    recentOrders: '近期消費記錄',
    topRankings: '消費愛好'
  },
  splitBillPopUp: {
    quantity: '人數',
    ok: '確定'
  },
  dateRange: {
    SHIFT: '開帳期間',
    TODAY: '今日',
    WEEK: '週',
    MONTH: '月',
    RANGE: '自訂日期'
  },
  salesReport: '銷售報表',
  staffTimeCardReport: '打卡記錄',
  customerStatsReport: '來客總覽',
  shiftHistory: '關帳紀錄',
  empty: '空',
  updateExpo: {
    haveUpdate: '發現新版本!',
    msg: '是否立即重啟以套用更新'
  },
  editPasswordPopUp: {
    passwordTitle: '設定密碼',
    editPassword: '編輯密碼',
    enterOldPassword: '輸入原本密碼',
    originalPassword: '原本密碼',
    enter: '輸入',
    enterNewPassword: '輸入新密碼',
    newPassword: '新密碼',
    incorrectPassword: '密碼輸入錯誤',
    passwordUpdated: '密碼更新成功',
    changePasswordAlert: '更改密碼將導致圖形密碼重置，是否繼續？'
  },
  openShift: {
    title: '請開帳來開始銷售',
    openBalance: '開帳現金',
    enterAmount: '請輸入金額',
    open: '開帳',
    cancel: '取消'
  },
  account: {
    username: '使用者代號',
    nickname: '暱稱',
    updateDate: '最後更新',
    gesturePassword: '圖形密碼',
    encodeToken: '產生員工登入碼',
    tokenShareSucess: '員工登入碼分享成功',
    tokenShareFailed: '員工登入碼分享失敗',
    loginWithAccount: '帳號登入',
    loginWithToken: '員工登入',

  },
  workingAreaScreen: {
    editWorkingAreaTitle: '編輯工作區',
    addWorkingAreaTitle: '新增工作區',
    workingAreaName: '名稱',
    noOfPrintCopies: '預設出單張數',
    linkedPrinters: '連結出單機設定',
    visibilityOption: '顯示範圍設定',
    showAll: '全部顯示',
    showInRoster: '顯示於排班',
    showInProduct: '顯示於產品管理',
  },
  inventory: {
    title: '庫存管理',
    inventoryEditFormTitle: '編輯庫存',
    inventoryNewFormTitle: '新增庫存',
    sku: 'Sku',
    labelName: '標籤',
    skuName: 'Sku名稱',
    searchSkuName: '搜尋Sku名稱',
    name: '標籤',
    unitOfMeasure: '單位',
    unitOfMeasureDefault: '預設單位：EACH',
    baseUnitQuantity: '每單位個數',
    baseUnitQuantityDefault: '預設單位數量：1',
    quantity: '單位數量',
    minimumStockLevel: '最小庫存量',
    addInventory: '新增一筆庫存',
    deleteAllInventory: '刪除全部庫存',
    process: '處理進貨單',
    copy: '複製進貨單',
    addSkuByProduct: '從現有產品裡新增一筆Sku',
    addNewProductAndSku: '新增新產品與一筆Sku',
    selectExistingProduct: '選擇產品名稱',
  },
  inventoryOrder: {
    newFormTitle: '新增庫存訂單',
    editFormTitle: '編輯庫存訂單',
    orderDate: '訂單日期',
    supplierId: '進貨商',
    supplierOrderId: '庫存訂單編號',
    sku: 'Sku',
    quantity: '數量',
    price: '單價',
    unitPrice: 'Unit Price',
    productName: '產品名稱',
    disableChangeOrderTitle: '無法變更',
    disableChangeOrderMessage: '已處理的進貨單不能修改。'
  }
}

export default zh
