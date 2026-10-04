import fs from 'node:fs';

const checkedAt = '2026-10-04';
const make = (id, category, original, titleZh, descriptionZh, sourceName, url, options = {}) => ({
  id, slug: id, titleOriginal: original, titleZh, descriptionZh,
  primaryCategory: category, tags: options.tags || ['德国生活'], levels: [], levelBasis: 'unspecified',
  skills: ['生活信息'], exams: [], formats: options.formats || ['网页'], price: options.price || 'unknown',
  access: options.access || 'open', languages: options.languages || ['德语'], sourceName, url,
  canonicalUrl: url, rights: 'link-only', status: 'published', linkStatus: 'unchecked',
  lastEditorialCheckedAt: checkedAt, providerId: options.providerId || id, providerType: options.providerType || 'unspecified',
  mediaTypes: options.mediaTypes || ['网页'], costNoteZh: options.costNoteZh || '信息入口免费；第三方交易、服务或订阅费用以原站为准。',
  accessNoteZh: options.accessNoteZh || '部分功能可能要求注册或登录，以原站为准。', interfaceLanguages: options.interfaceLanguages || ['德语'],
  levelScope: 'information', aliases: options.aliases || [], editorialStatus: 'partial',
  evidence: [{ url, fields: ['purpose'], checkedAt }],
});

const resources = [
  // 社交、社区与活动
  make('nebenan', 'social', 'nebenan.de', 'nebenan.de 邻里社区', '按街区连接邻居、发布本地信息和互助请求的德国社区平台。', 'nebenan.de', 'https://nebenan.de/', { providerType: 'community', tags: ['社区', '邻里', '互助'], access: 'registration' }),
  make('meetup-germany', 'social', 'Meetup Deutschland', 'Meetup 德国线下活动', '查找德国各城市的语言交换、技术、兴趣和社交活动。', 'Meetup', 'https://www.meetup.com/find/?location=de--Berlin', { providerType: 'community', tags: ['活动', '兴趣小组', '线下'], access: 'registration' }),
  make('internations-germany', 'social', 'InterNations Germany', 'InterNations 德国外籍人士社区', '面向在德国生活的国际人士，提供城市社区、活动和经验交流入口。', 'InterNations', 'https://www.internations.org/germany-expats', { providerType: 'community', tags: ['外籍人士', '社区', '活动'], access: 'registration' }),
  make('toy-town-germany', 'social', 'Toytown Germany', 'Toytown Germany 英语社区', '长期运行的德国英语社区，包含城市生活、工作和办事讨论。', 'Toytown Germany', 'https://www.toytowngermany.com/', { providerType: 'community', tags: ['英语社区', '城市生活', '讨论'] , languages: ['英语', '德语'] }),
  make('reddit-germany', 'social', 'r/germany', 'Reddit Germany 社区', '德国相关的公开讨论区，可浏览生活、旅行和社会话题。', 'Reddit', 'https://www.reddit.com/r/germany/', { providerType: 'community', tags: ['社区', '讨论', '英语'], languages: ['英语', '德语'], access: 'registration' }),
  make('couchsurfing-germany', 'social', 'Couchsurfing Germany', 'Couchsurfing 德国社区', '旅行者和当地人交流、参加活动与寻找短期接待信息的社区入口。', 'Couchsurfing', 'https://www.couchsurfing.com/places/germany', { providerType: 'community', tags: ['旅行', '活动', '社区'], access: 'registration' }),

  // 租房与住房
  make('immobilienscout24', 'housing', 'ImmoScout24', 'ImmoScout24 房屋与公寓', '德国规模较大的房屋出租、购买和房源搜索平台。', 'ImmoScout24', 'https://www.immobilienscout24.de/', { providerType: 'commercial', tags: ['租房', '买房', '房源'], access: 'registration' }),
  make('immowelt', 'housing', 'immowelt', 'immowelt 房产平台', '搜索德国出租、出售、公寓和房屋房源。', 'immowelt', 'https://www.immowelt.de/', { providerType: 'commercial', tags: ['租房', '房产', '房源'] }),
  make('immonet', 'housing', 'Immonet', 'Immonet 房屋搜索', '德国住宅、合租和商业房产搜索入口。', 'Immonet', 'https://www.immonet.de/', { providerType: 'commercial', tags: ['租房', '房产', '公寓'] }),
  make('wg-gesucht', 'housing', 'WG-Gesucht.de', 'WG-Gesucht 合租与短租', '德国学生和年轻人常用的合租、整租、短租房源平台。', 'WG-Gesucht', 'https://www.wg-gesucht.de/', { providerType: 'commercial', tags: ['合租', '短租', '学生住房'], access: 'registration' }),
  make('wohnungsboerse', 'housing', 'Wohnungsbörse', 'Wohnungsbörse 房源搜索', '按城市搜索德国出租房、公寓和房屋信息。', 'Wohnungsbörse', 'https://www.wohnungsboerse.net/', { providerType: 'commercial', tags: ['租房', '公寓', '房源'] }),
  make('kleinanzeigen-housing', 'housing', 'Kleinanzeigen Immobilien', 'Kleinanzeigen 房屋分类', '德国分类信息网站中的房屋出租、出售和合租入口。', 'Kleinanzeigen', 'https://www.kleinanzeigen.de/s-wohnung-mieten/c203', { providerType: 'commercial', tags: ['租房', '合租', '分类信息'], access: 'registration' }),
  make('wohngeld-bund', 'housing', 'Wohngeld.de', '德国住房补贴信息入口', '了解德国 Wohngeld 住房补贴概念并进入地方申请信息。', 'Bundesministerium für Wohnen', 'https://www.bmwsb.bund.de/DE/wohnen/wohngeld/wohngeld_node.html', { providerType: 'institution', tags: ['住房补贴', '官方信息'], costNoteZh: '信息入口免费；资格与金额由主管机关审核。' }),

  // 工作与职业
  make('arbeitsagentur-jobsuche', 'jobs', 'Jobsuche', '联邦就业局 Jobsuche', '德国联邦就业局官方职位、培训和实习搜索平台。', 'Bundesagentur für Arbeit', 'https://www.arbeitsagentur.de/jobsuche/', { providerType: 'institution', tags: ['求职', '培训', '官方'], providerId: 'arbeitsagentur', languages: ['德语'] }),
  make('make-it-in-germany-jobs', 'jobs', 'Make it in Germany Jobs', 'Make it in Germany 职位搜索', '面向国际专业人才的德国职位和移民就业信息入口。', 'Make it in Germany', 'https://www.make-it-in-germany.com/en/working-in-germany/job-listings', { providerType: 'institution', tags: ['国际求职', '职位', '官方'], languages: ['英语', '德语'] }),
  make('stepstone-germany', 'jobs', 'StepStone Deutschland', 'StepStone 德国职位', '德国企业职位、行业和地区搜索平台。', 'StepStone', 'https://www.stepstone.de/', { providerType: 'commercial', tags: ['求职', '职位', '职业'] }),
  make('indeed-germany', 'jobs', 'Indeed Deutschland', 'Indeed 德国职位', '按关键词、地点和职位类型搜索德国工作。', 'Indeed', 'https://de.indeed.com/', { providerType: 'commercial', tags: ['求职', '职位', '招聘'] }),
  make('linkedin-jobs-germany', 'jobs', 'LinkedIn Jobs Germany', 'LinkedIn 德国职位', '通过职业社交网络搜索德国职位和公司。', 'LinkedIn', 'https://www.linkedin.com/jobs/search/?location=Germany', { providerType: 'commercial', tags: ['职业社交', '求职', '职位'], access: 'registration', languages: ['英语', '德语'] }),
  make('xing-jobs', 'jobs', 'XING Jobs', 'XING 德国职位', '德国职业社交网络的职位和职业信息入口。', 'XING', 'https://www.xing.com/jobs', { providerType: 'commercial', tags: ['职业社交', '求职', '职位'], access: 'registration' }),
  make('kununu', 'jobs', 'kununu', 'kununu 公司评价与薪资', '查看德国公司评价、薪资和雇主信息，辅助求职比较。', 'kununu', 'https://www.kununu.com/de', { providerType: 'commercial', tags: ['公司评价', '薪资', '求职'] }),
  make('azubi-de', 'jobs', 'Azubi.de', 'Azubi.de Ausbildung 职位', '德国职业培训 Ausbildung、实习和入门岗位搜索。', 'Azubi.de', 'https://www.azubi.de/', { providerType: 'commercial', tags: ['Ausbildung', '实习', '职业培训'] }),

  // 二手交易、租借与服务
  make('kleinanzeigen', 'classifieds', 'Kleinanzeigen', 'Kleinanzeigen 德国分类信息', '德国常用的二手买卖、赠送、服务和本地交易平台。', 'Kleinanzeigen', 'https://www.kleinanzeigen.de/', { providerType: 'commercial', tags: ['二手', '买卖', '本地交易'], access: 'registration' }),
  make('quoka', 'classifieds', 'Quoka', 'Quoka 分类信息', '德国二手物品、车辆、房屋和本地服务分类信息。', 'Quoka', 'https://www.quoka.de/', { providerType: 'commercial', tags: ['二手', '分类信息', '服务'] }),
  make('markt-de', 'classifieds', 'markt.de', 'markt.de 分类信息', '覆盖二手、房产、汽车、工作和本地服务的分类信息平台。', 'markt.de', 'https://www.markt.de/', { providerType: 'commercial', tags: ['二手', '分类信息', '本地服务'] }),
  make('ebay-germany', 'classifieds', 'eBay Deutschland', 'eBay 德国', '德国在线拍卖和购物平台，适合查找新旧商品。', 'eBay', 'https://www.ebay.de/', { providerType: 'commercial', tags: ['购物', '二手', '拍卖'], access: 'registration' }),
  make('momox', 'classifieds', 'momox', 'momox 二手书与媒体回收', '出售或购买二手书、CD、DVD和游戏的德国平台。', 'momox', 'https://www.momox.de/', { providerType: 'commercial', tags: ['二手书', '回收', '买卖'] }),
  make('swapfiets', 'classifieds', 'Swapfiets', 'Swapfiets 月租自行车', '在德国城市按月租用和维护自行车的服务。', 'Swapfiets', 'https://swapfiets.de/', { providerType: 'commercial', tags: ['租赁', '自行车', '城市生活'], price: 'paid' }),
  make('boels', 'classifieds', 'Boels Deutschland', 'Boels 工具与设备租赁', '在德国租用施工、园艺、活动和家庭使用的设备。', 'Boels', 'https://www.boels.com/de-de', { providerType: 'commercial', tags: ['设备租赁', '工具', '服务'], price: 'paid' }),
  make('miet24', 'classifieds', 'Miet24', 'Miet24 物品租赁搜索', '查找德国不同类别的设备、物品和活动用品租赁服务。', 'Miet24', 'https://www.miet24.de/', { providerType: 'commercial', tags: ['物品租赁', '设备', '服务'], price: 'paid' }),

  // 交通与出行
  make('bahn', 'mobility', 'Deutsche Bahn International', '德国铁路 Deutsche Bahn', '德国铁路时刻、购票、长途和区域交通信息。', 'Deutsche Bahn', 'https://int.bahn.de/en', { providerType: 'commercial', tags: ['火车', '购票', '公共交通'], price: 'paid', languages: ['英语', '德语'] }),
  make('flixbus', 'mobility', 'FlixBus', 'FlixBus 德国长途巴士', '德国及欧洲城市间长途巴士班次和购票入口。', 'FlixBus', 'https://www.flixbus.de/', { providerType: 'commercial', tags: ['巴士', '旅行', '购票'], price: 'paid' }),
  make('flixtrain', 'mobility', 'FlixTrain', 'FlixTrain 德国铁路', '德国部分城市间的低价长途列车和购票入口。', 'FlixTrain', 'https://www.flixtrain.de/', { providerType: 'commercial', tags: ['火车', '旅行', '购票'], price: 'paid' }),
  make('deutschlandticket', 'mobility', 'Deutschlandticket', 'Deutschlandticket 德国通票信息', '德国 Deutschlandticket 的官方说明、适用范围和购买入口。', 'Deutschlandticket', 'https://deutschlandticket.de/', { providerType: 'commercial', tags: ['公共交通', '月票', '出行'], price: 'paid' }),
  make('bvg', 'mobility', 'BVG', '柏林 BVG 公共交通', '柏林地铁、公交、有轨电车路线、时刻和票务信息。', 'BVG', 'https://www.bvg.de/', { providerType: 'institution', tags: ['柏林', '公共交通', '路线'], price: 'paid' }),
  make('mvg', 'mobility', 'MVG München', '慕尼黑 MVG 公共交通', '慕尼黑地铁、公交和电车路线、票务与实时信息。', 'MVG', 'https://www.mvg.de/', { providerType: 'institution', tags: ['慕尼黑', '公共交通', '路线'], price: 'paid' }),
  make('moovit-germany', 'mobility', 'Moovit Germany', 'Moovit 公共交通规划', '规划德国城市公共交通路线并查看出行时间。', 'Moovit', 'https://moovitapp.com/index/en/public_transit-Germany-1906', { providerType: 'commercial', tags: ['路线规划', '公共交通', '导航'], languages: ['英语', '德语'] }),
  make('miles', 'mobility', 'MILES Carsharing', 'MILES 汽车共享', '德国多座城市的按里程计费汽车共享服务。', 'MILES', 'https://miles-mobility.com/', { providerType: 'commercial', tags: ['共享汽车', '租车', '城市交通'], price: 'paid', access: 'registration' }),
  make('nextbike', 'mobility', 'nextbike', 'nextbike 公共自行车', '德国多个城市的自行车租借和共享单车服务。', 'nextbike', 'https://www.nextbike.de/', { providerType: 'commercial', tags: ['共享单车', '租车', '城市交通'], price: 'paid', access: 'registration' }),

  // 政府、办事与证件
  make('bund-de', 'government', 'Bund.de', 'Bund.de 德国政府服务', '德国联邦政府机构、公共服务和办事信息总入口。', 'Bundesregierung', 'https://www.bund.de/', { providerType: 'institution', tags: ['政府', '办事', '官方'] , languages: ['德语'] }),
  make('service-bund', 'government', 'Serviceportal Deutschland', '德国公共服务门户', '查找德国公共行政服务、表格和地方办事入口。', 'Bundesregierung', 'https://verwaltung.bund.de/', { providerType: 'institution', tags: ['政府', '办事', '表格'] }),
  make('ausweisapp', 'government', 'AusweisApp', 'AusweisApp 电子身份证', '德国电子身份证线上身份验证应用和使用说明。', 'Bundesamt für Sicherheit in der Informationstechnik', 'https://www.ausweisapp.bund.de/', { providerType: 'institution', tags: ['身份证', '电子政务', '官方'], mediaTypes: ['网页', '应用'] }),
  make('elster', 'government', 'ELSTER', 'ELSTER 德国电子报税', '德国税务申报、税务账户和电子税务服务官方入口。', 'Finanzverwaltung Deutschland', 'https://www.elster.de/', { providerType: 'institution', tags: ['税务', '报税', '官方'], access: 'registration' }),
  make('service-nrw', 'government', 'Serviceportal NRW', '北威州 Serviceportal', '北莱茵-威斯特法伦州政府办事和公共服务搜索入口。', 'Land Nordrhein-Westfalen', 'https://service.nrw.de/', { providerType: 'institution', tags: ['北威州', '办事', '官方'] }),
  make('berlin-de', 'government', 'Berlin.de', 'Berlin.de 柏林政府服务', '柏林州政府、预约、办事和城市公共信息入口。', 'Land Berlin', 'https://www.berlin.de/', { providerType: 'institution', tags: ['柏林', '办事', '官方'] }),
  make('deutsche-rentenversicherung', 'government', 'Deutsche Rentenversicherung', '德国养老保险', '德国法定养老保险、退休、缴费和咨询信息。', 'Deutsche Rentenversicherung', 'https://www.deutsche-rentenversicherung.de/', { providerType: 'institution', tags: ['养老', '保险', '官方'] }),
  make('bamf-migration', 'government', 'BAMF Migration', 'BAMF 移民与融入', '德国联邦移民与难民局的移民、居留和融入信息入口。', 'BAMF', 'https://www.bamf.de/EN/Startseite/startseite_node.html', { providerType: 'institution', tags: ['移民', '居留', '官方'], languages: ['德语', '英语'] }),

  // 金融、保险与消费比较
  make('check24', 'finance', 'CHECK24', 'CHECK24 德国比较平台', '比较保险、能源、网络、银行和旅行服务的德国平台。', 'CHECK24', 'https://www.check24.de/', { providerType: 'commercial', tags: ['比较', '保险', '消费'], access: 'registration' }),
  make('verivox', 'finance', 'Verivox', 'Verivox 费用比较', '比较电力、燃气、网络、手机和保险等生活服务。', 'Verivox', 'https://www.verivox.de/', { providerType: 'commercial', tags: ['比较', '能源', '网络'] }),
  make('finanztip', 'finance', 'Finanztip', 'Finanztip 消费金融指南', '提供保险、银行、投资、税务和日常财务的独立信息与比较。', 'Finanztip', 'https://www.finanztip.de/', { providerType: 'independent', tags: ['财务信息', '保险', '消费'], languages: ['德语'] }),
  make('ba-finanzwissen', 'finance', 'BaFin Verbraucher', 'BaFin 金融消费者信息', '德国金融监管机构面向消费者的账户、投资、保险和诈骗提示。', 'BaFin', 'https://www.bafin.de/DE/Verbraucher/verbraucher_node.html', { providerType: 'institution', tags: ['金融监管', '消费者', '官方'], languages: ['英语', '德语'] }),
  make('verbraucherzentrale-finance', 'finance', 'Verbraucherzentrale Finanzen', '消费者中心金融与保险', '德国消费者中心的保险、合同、银行和金融消费信息。', 'Verbraucherzentrale', 'https://www.verbraucherzentrale.de/wissen/geld-versicherungen', { providerType: 'institution', tags: ['消费者', '保险', '合同'] }),

  // 医疗与健康
  make('116117', 'health', '116117', '116117 医疗服务', '德国法定医疗服务值班、非急症帮助、医生和心理治疗预约入口。', 'Kassenärztliche Bundesvereinigung', 'https://www.116117.de/', { providerType: 'institution', tags: ['医疗', '医生', '预约'], languages: ['德语'] }),
  make('doctolib', 'health', 'Doctolib Deutschland', 'Doctolib 医生预约', '按地点和专科搜索德国医生并预约。', 'Doctolib', 'https://www.doctolib.de/', { providerType: 'commercial', tags: ['医生', '预约', '医疗'], access: 'registration' }),
  make('jameda', 'health', 'jameda', 'jameda 医生与诊所', '搜索德国医生、诊所、专科和患者评价。', 'jameda', 'https://www.jameda.de/', { providerType: 'commercial', tags: ['医生', '诊所', '评价'] }),
  make('apotheken-umschau', 'health', 'Apotheken Umschau', 'Apotheken Umschau 健康信息', '德国药房杂志的疾病、药物和健康知识入口。', 'Wort & Bild Verlag', 'https://www.apotheken-umschau.de/', { providerType: 'publisher', tags: ['健康', '药物', '医学信息'] }),
  make('gesund-bund-english', 'health', 'gesund.bund.de English', 'gesund.bund.de 英文健康信息', '德国联邦卫生部的疾病、医疗和健康服务信息。', 'Bundesministerium für Gesundheit', 'https://gesund.bund.de/en', { providerType: 'institution', tags: ['健康', '医疗', '官方'], languages: ['英语', '德语'] }),

  // 购物、价格与日常服务
  make('idealo', 'shopping', 'idealo Deutschland', 'idealo 德国价格比较', '比较德国线上商店的商品价格、配送和评价。', 'idealo', 'https://www.idealo.de/', { providerType: 'commercial', tags: ['价格比较', '购物', '消费'] }),
  make('geizhals', 'shopping', 'Geizhals Deutschland', 'Geizhals 电子产品比价', '电子产品、家电和电脑配件的德国价格比较与规格信息。', 'Geizhals', 'https://geizhals.de/', { providerType: 'commercial', tags: ['电子产品', '价格比较', '购物'] }),
  make('dm', 'shopping', 'dm-drogerie markt', 'dm 德国日用品', '德国常用日用品、护理、药妆和家庭用品商店入口。', 'dm', 'https://www.dm.de/', { providerType: 'commercial', tags: ['日用品', '药妆', '购物'] }),
  make('rossmann', 'shopping', 'ROSSMANN', 'ROSSMANN 德国日用品', '德国日用品、护理、家庭和婴幼儿用品商店入口。', 'ROSSMANN', 'https://www.rossmann.de/', { providerType: 'commercial', tags: ['日用品', '家庭', '购物'] }),
  make('rewe', 'shopping', 'REWE', 'REWE 德国超市', '德国超市、食品配送和门店服务入口。', 'REWE', 'https://www.rewe.de/', { providerType: 'commercial', tags: ['超市', '食品', '配送'] }),
  make('lieferando', 'shopping', 'Lieferando', 'Lieferando 外卖配送', '在德国搜索餐厅并进行外卖或自取下单。', 'Lieferando', 'https://www.lieferando.de/', { providerType: 'commercial', tags: ['外卖', '餐饮', '配送'], price: 'paid', access: 'registration' }),

  // 旅行与短住
  make('germany-travel', 'travel', 'Germany Travel', '德国国家旅游局', '德国城市、自然、文化和旅行规划官方信息。', 'German National Tourist Board', 'https://www.germany.travel/en/home.html', { providerType: 'institution', tags: ['旅行', '城市', '官方'], languages: ['英语', '德语'] }),
  make('booking-germany', 'travel', 'Booking.com Germany', 'Booking.com 德国住宿', '搜索德国酒店、公寓和短期住宿。', 'Booking.com', 'https://www.booking.com/country/de.html', { providerType: 'commercial', tags: ['住宿', '旅行', '酒店'], price: 'paid', access: 'registration' }),
  make('hostelworld-germany', 'travel', 'Hostelworld Germany', 'Hostelworld 德国青旅', '搜索德国青年旅舍和经济型短住。', 'Hostelworld', 'https://www.hostelworld.com/st/hostels/europe/germany/', { providerType: 'commercial', tags: ['青旅', '住宿', '旅行'], price: 'paid', access: 'registration' }),
];

const categories = [
  ['social', '社交与社区', '德国社交网络、邻里社区、活动和国际交流。', '社交'],
  ['housing', '租房与住房', '租房、合租、房源和住房补贴信息入口。', '住房'],
  ['jobs', '工作与职业', '求职、职业社交、培训和雇主信息。', '工作'],
  ['classifieds', '二手与租借', '二手交易、分类信息、物品和设备租赁。', '交易'],
  ['mobility', '交通与出行', '铁路、巴士、公共交通、共享汽车和自行车。', '交通'],
  ['government', '政府与办事', '联邦、州政府、税务、证件和公共服务。', '办事'],
  ['finance', '金融与保险', '金融消费者信息、费用比较、保险和财务服务。', '金融'],
  ['health', '医疗与健康', '医生预约、医疗服务、健康和药物信息。', '健康'],
  ['shopping', '购物与日常', '价格比较、超市、日用品和生活配送。', '购物'],
  ['travel', '旅行与短住', '德国旅行、酒店、青年旅舍和短期住宿。', '旅行'],
];

const resourcePath = new URL('../data/resources.json', import.meta.url);
const categoryPath = new URL('../data/categories.json', import.meta.url);
const existing = JSON.parse(fs.readFileSync(resourcePath, 'utf8'));
const existingIds = new Set(existing.map(row => row.id));
const additions = resources.filter(row => !existingIds.has(row.id));
const merged = [...existing, ...additions];
for (const row of merged) {
  if (!row.howToUseZh) row.howToUseZh = '打开原站，按页面提示查找相关信息；费用、资格和可用性以原站为准。';
}
const currentCategories = JSON.parse(fs.readFileSync(categoryPath, 'utf8'));
const currentIds = new Set(currentCategories.map(row => row.id));
for (const [id, name, description, accent] of categories) if (!currentIds.has(id)) currentCategories.push({ id, name, description, accent });
fs.writeFileSync(resourcePath, `${JSON.stringify(merged, null, 2)}\n`);
fs.writeFileSync(categoryPath, `${JSON.stringify(currentCategories, null, 2)}\n`);
console.log(JSON.stringify({ additions: additions.length, resources: merged.length, categories: currentCategories.length, newCategories: categories.map(row => row[0]) }));
