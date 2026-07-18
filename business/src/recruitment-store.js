const KEY='thaitype-business-mvp-v1'

const id=prefix=>`${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`
const now=()=>new Date().toISOString()

const templates=[
  {id:'tpl_service',name:'泰语客服专员',description:'即时回复、订单信息与客户沟通',duration:5,minSpeed:32,minAccuracy:92,weights:{speed:30,accuracy:45,stability:15,integrity:10},questionIds:['q_service','q_order'],status:'启用',version:1},
  {id:'tpl_data',name:'泰语数据录入员',description:'姓名、地址、数字与长时间稳定录入',duration:6,minSpeed:36,minAccuracy:97,weights:{speed:25,accuracy:50,stability:15,integrity:10},questionIds:['q_address','q_order'],status:'启用',version:1},
  {id:'tpl_admin',name:'泰语行政文员',description:'正式文书、日期、姓名和办公信息',duration:5,minSpeed:30,minAccuracy:95,weights:{speed:25,accuracy:50,stability:15,integrity:10},questionIds:['q_admin','q_address'],status:'启用',version:1},
  {id:'tpl_content',name:'泰语内容运营',description:'长文本、标点和内容修订能力',duration:7,minSpeed:38,minAccuracy:94,weights:{speed:35,accuracy:40,stability:15,integrity:10},questionIds:['q_content','q_service'],status:'启用',version:1}
]

const questions=[
  {id:'q_service',type:'业务场景',industry:'客服',difficulty:'中等',title:'客户咨询回复',text:'สวัสดีค่ะ ขอบคุณที่ติดต่อเรา สินค้าของคุณกำลังอยู่ระหว่างการจัดส่ง และคาดว่าจะถึงภายในสองวันทำการ',status:'启用'},
  {id:'q_order',type:'结构化录入',industry:'通用',difficulty:'中等',title:'订单信息录入',text:'คำสั่งซื้อ TH-20489 จำนวน 3 ชิ้น ยอดชำระ 1,290 บาท จัดส่งวันที่ 18 กรกฎาคม 2569',status:'启用'},
  {id:'q_address',type:'结构化录入',industry:'行政',difficulty:'困难',title:'泰文地址录入',text:'คุณศิริพร แสงทอง 88 ถนนสุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110',status:'启用'},
  {id:'q_admin',type:'标准抄写',industry:'行政',difficulty:'中等',title:'会议通知',text:'บริษัทขอแจ้งกำหนดการประชุมประจำเดือนในวันศุกร์ เวลาเก้านาฬิกา ณ ห้องประชุมชั้นห้า',status:'启用'},
  {id:'q_content',type:'长文稳定性',industry:'内容',difficulty:'困难',title:'内容编辑',text:'การพัฒนาทักษะการพิมพ์ภาษาไทยอย่างสม่ำเสมอช่วยให้การทำงานรวดเร็วขึ้น ลดข้อผิดพลาด และทำให้การสื่อสารในองค์กรมีประสิทธิภาพมากขึ้น',status:'启用'}
]

const initial=()=>({
  organization:{id:'org_demo',name:'Bangkok Language Center',country:'Thailand',brand:'#0f5b4d',plan:'专业试用版',credits:50,dataRetentionDays:180},
  currentUser:{id:'u_admin',name:'陈经理',email:'hr@example.com',role:'企业管理员'},
  members:[
    {id:'u_admin',name:'陈经理',email:'hr@example.com',role:'企业管理员',status:'已加入'},
    {id:'u_recruiter',name:'Nicha',email:'nicha@example.com',role:'招聘经理',status:'已加入'},
    {id:'u_viewer',name:'Somchai',email:'somchai@example.com',role:'只读成员',status:'已邀请'}
  ],
  templates,questions,
  projects:[{id:'p_demo',name:'曼谷客服中心 · 7月招聘',templateId:'tpl_service',owner:'Nicha',deadline:'2026-08-15',status:'进行中',createdAt:now()}],
  candidates:[
    {id:'c_demo_1',projectId:'p_demo',name:'Anan Chai',email:'anan@example.com',token:'DEMO-ANAN',status:'已完成',invitedAt:now(),resultId:'r_demo_1',tags:['客服'],notes:'口语面试表现良好'},
    {id:'c_demo_2',projectId:'p_demo',name:'Mali S.',email:'mali@example.com',token:'DEMO-MALI',status:'已邀请',invitedAt:now(),resultId:null,tags:['待测'],notes:''}
  ],
  sessions:[],
  results:[{id:'r_demo_1',candidateId:'c_demo_1',projectId:'p_demo',completedAt:now(),speed:39,rawSpeed:43,accuracy:96.4,firstAccuracy:93.1,stability:91,completion:100,score:92,integrity:96,integrityLabel:'高可信',recommendation:'推荐进入下一轮',errors:{wrong:3,missing:1,extra:0,corrections:4},anomalies:[],durationSeconds:124}],
  proctoring:{enabled:false,mode:'基础行为监考',photo:false,cameraSnapshots:false,facePresence:false,multipleFaces:false,idVerification:false,microphone:false,screenRecording:false,snapshotInterval:60,retentionDays:30,alternativeAllowed:true},
  reviewQueue:[{id:'review_demo',candidateId:'c_demo_1',reason:'示例：结果可信，可直接通过',risk:'低',status:'已通过',reviewer:'Nicha',createdAt:now()}],
  privacy:{policyVersion:'1.0',candidateExport:true,candidateDeletion:true,autoDelete:true,fairnessGuard:true,excludedFields:['国家','年龄','性别'],retentionDays:180,requests:[{id:'privacy_demo',candidate:'Demo Candidate',type:'数据导出',status:'已完成',createdAt:now()}]},
  billing:{plan:'专业版',renewal:'月付',nextBillingDate:'2026-08-18',currency:'THB',packages:[{id:'pkg_50',name:'50次测评包',credits:50,price:2990},{id:'pkg_200',name:'200次测评包',credits:200,price:9900},{id:'pkg_1000',name:'1000次测评包',credits:1000,price:39900}],transactions:[{id:'txn_demo',type:'试用额度',credits:50,amount:0,status:'已入账',createdAt:now()}]},
  notifications:{templates:[{id:'nt_invite',type:'测评邀请',subject:'ThaiType 招聘测评邀请',enabled:true},{id:'nt_reminder',type:'未完成提醒',subject:'您的测评即将到期',enabled:true},{id:'nt_complete',type:'完成通知',subject:'候选人已完成测评',enabled:true},{id:'nt_credit',type:'额度提醒',subject:'企业测评额度不足',enabled:true}],logs:[{id:'nl_demo',type:'测评邀请',recipient:'anan@example.com',status:'已送达',createdAt:now()}]},
  integrations:{apiEnabled:false,apiKey:null,webhooks:[],sso:{enabled:false,provider:'SAML 2.0',domain:''},ats:{provider:'未连接',status:'未连接',lastSync:null},rateLimit:1000},
  validation:{
    releaseGate:'未通过',lastRun:null,
    matrix:[
      {id:'qa_lang',area:'五语言界面',status:'已通过',evidence:'营销站、控制台和候选人入口'},
      {id:'qa_browser',area:'浏览器兼容',status:'待验证',evidence:'Chrome、Safari、Edge、Firefox'},
      {id:'qa_input',area:'泰语输入法',status:'待验证',evidence:'Windows、macOS原生泰语键盘'},
      {id:'qa_recovery',area:'断网恢复',status:'已通过',evidence:'本地会话保存'},
      {id:'qa_permission',area:'权限与数据隔离',status:'已通过',evidence:'四角色权限模型'},
      {id:'qa_scoring',area:'评分计算',status:'待校准',evidence:'需要真实泰语样本'},
      {id:'qa_integrity',area:'异常检测误报率',status:'待校准',evidence:'需要监考样本'},
      {id:'qa_report',area:'报告与导出',status:'已通过',evidence:'网页、PDF打印、CSV'},
      {id:'qa_load',area:'并发与压力测试',status:'待生产环境',evidence:'本地版本不代表生产容量'},
      {id:'qa_privacy',area:'隐私删除与保留',status:'待生产环境',evidence:'需要服务端清理任务'}
    ],
    calibration:{sampleSize:1,targetSampleSize:120,baselineAccuracy:95,baselineSpeed:32,falsePositiveRate:null,lastUpdated:now()},
    cohorts:[{id:'cohort_demo',name:'内部泰语熟练者基线',participants:1,medianSpeed:39,medianAccuracy:96.4,status:'样本不足'}]
  },
  pilots:{
    programs:[
      {id:'pilot_1',organization:'客服中心试点',segment:'客服中心',owner:'Nicha',target:30,completed:0,status:'准备中',startDate:'2026-08-01',successMetric:'完成率≥80%，HR报告满意度≥4/5'},
      {id:'pilot_2',organization:'数据录入团队试点',segment:'数据录入',owner:'陈经理',target:20,completed:0,status:'待邀请',startDate:'2026-08-08',successMetric:'岗位标准区分度有效'},
      {id:'pilot_3',organization:'语言机构试点',segment:'语言机构',owner:'Nicha',target:40,completed:0,status:'待邀请',startDate:'2026-08-15',successMetric:'管理员可独立完成配置'},
      {id:'pilot_4',organization:'普通企业招聘试点',segment:'普通企业',owner:'陈经理',target:20,completed:0,status:'待邀请',startDate:'2026-08-22',successMetric:'报告支持下一轮决策'}
    ],
    feedback:[{id:'fb_demo',pilotId:'pilot_1',role:'HR',score:4,category:'报告清晰度',comment:'示例反馈：需要更多岗位对比解释',createdAt:now()}],
    criteria:{hrIndependent:true,candidateClarity:true,reportDecisionValue:true,thresholdReasonable:true,pricingValidated:false,integrityAcceptable:false}
  },
  operations:{
    launchStatus:'未就绪',launchChecklist:[
      {id:'launch_domain',item:'生产域名与HTTPS',status:'待完成',owner:'技术'},
      {id:'launch_auth',item:'生产认证与数据库',status:'待完成',owner:'技术'},
      {id:'launch_email',item:'邮件与验证码服务',status:'待完成',owner:'运营'},
      {id:'launch_payment',item:'支付、发票与额度联调',status:'待完成',owner:'财务'},
      {id:'launch_legal',item:'隐私政策与服务协议审核',status:'待完成',owner:'法务'},
      {id:'launch_backup',item:'备份、监控与事故预案',status:'待完成',owner:'技术'},
      {id:'launch_pilot',item:'四类企业试点验收',status:'待完成',owner:'产品'}
    ],
    metrics:{inviteRate:100,startRate:50,completionRate:50,dropOffRate:0,integrityReviewRate:0,avgScore:92,renewalRate:null},
    improvements:[
      {id:'imp_1',title:'收集120份泰语基准样本',source:'评分校准',priority:'高',status:'待处理'},
      {id:'imp_2',title:'验证防作弊误报率低于5%',source:'企业试点',priority:'高',status:'待处理'},
      {id:'imp_3',title:'根据HR录用反馈校准岗位权重',source:'持续运营',priority:'中',status:'待处理'}
    ]
  },
  audit:[{id:id('audit'),at:now(),user:'系统',action:'创建演示企业数据'}]
})

export function load(){
  try{const saved=JSON.parse(localStorage.getItem(KEY));if(!saved)return reset();const defaults=initial();for(const key of ['proctoring','reviewQueue','privacy','billing','notifications','integrations','validation','pilots','operations'])if(saved[key]===undefined)saved[key]=defaults[key];return save(saved)}catch{return reset()}
}
export function save(data){localStorage.setItem(KEY,JSON.stringify(data));return data}
export function reset(){const data=initial();return save(data)}
export function makeId(prefix){return id(prefix)}
export function stamp(data,action){data.audit.unshift({id:id('audit'),at:now(),user:data.currentUser.name,action});return save(data)}
export function inviteUrl(token){return `${location.origin}/assessment.html?token=${encodeURIComponent(token)}`}
export function csv(rows){
  const escape=value=>`"${String(value??'').replaceAll('"','""')}"`
  return rows.map(row=>row.map(escape).join(',')).join('\n')
}
