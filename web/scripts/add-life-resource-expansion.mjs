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
  // 通讯、社交媒体与数字网络
  make('whatsapp', 'communication', 'WhatsApp', 'WhatsApp 通讯', '德国日常使用广泛的即时通讯、群组和语音视频通话服务。', 'WhatsApp', 'https://www.whatsapp.com/', { providerType: 'commercial', tags: ['通讯', '聊天', '群组'], access: 'registration', languages: ['德语', '英语'] }),
  make('signal', 'communication', 'Signal', 'Signal 私密通讯', '注重端到端加密的即时通讯和群组聊天应用。', 'Signal', 'https://signal.org/de/', { providerType: 'commercial', tags: ['通讯', '隐私', '加密'], access: 'registration', languages: ['德语', '英语'] }),
  make('telegram', 'communication', 'Telegram', 'Telegram 通讯与频道', '提供群组、频道和跨设备消息同步的通讯平台。', 'Telegram', 'https://telegram.org/', { providerType: 'commercial', tags: ['通讯', '频道', '群组'], access: 'registration', languages: ['英语', '德语'] }),
  make('facebook', 'communication', 'Facebook', 'Facebook 德国社交网络', '用于朋友联系、德国本地群组、活动和社区信息。', 'Meta', 'https://www.facebook.com/', { providerType: 'commercial', tags: ['社交网络', '群组', '活动'], access: 'registration', languages: ['德语', '英语'] }),
  make('instagram', 'communication', 'Instagram', 'Instagram 社交媒体', '图片、短视频、创作者和本地商家信息平台。', 'Meta', 'https://www.instagram.com/', { providerType: 'commercial', tags: ['社交网络', '图片', '短视频'], access: 'registration', languages: ['德语', '英语'] }),
  make('tiktok', 'communication', 'TikTok Deutschland', 'TikTok 德国短视频', '短视频、直播和创作者内容平台。', 'TikTok', 'https://www.tiktok.com/', { providerType: 'commercial', tags: ['短视频', '直播', '社交网络'], access: 'registration', languages: ['德语', '英语'] }),
  make('youtube', 'communication', 'YouTube Deutschland', 'YouTube 视频平台', '视频、音乐、直播和德国创作者内容入口。', 'Google', 'https://www.youtube.com/', { providerType: 'commercial', tags: ['视频', '音乐', '直播'], languages: ['德语', '英语'] }),
  make('discord', 'communication', 'Discord', 'Discord 社区与语音聊天', '面向兴趣、游戏和学习社群的文字、语音和视频平台。', 'Discord', 'https://discord.com/', { providerType: 'commercial', tags: ['社区', '语音', '群组'], access: 'registration', languages: ['德语', '英语'] }),
  make('twitch', 'communication', 'Twitch Deutschland', 'Twitch 直播', '游戏、音乐和创作者直播平台。', 'Twitch', 'https://www.twitch.tv/', { providerType: 'commercial', tags: ['直播', '游戏', '创作者'], languages: ['德语', '英语'] }),
  make('mastodon-germany', 'communication', 'Mastodon', 'Mastodon 联邦社交网络', '去中心化社交网络，可通过德国或欧洲实例参与公开讨论。', 'Mastodon', 'https://joinmastodon.org/de', { providerType: 'community', tags: ['社交网络', '开放网络', '隐私'], languages: ['德语', '英语'] }),
  make('telekom', 'communication', 'Deutsche Telekom', '德国电信 Telekom', '德国手机、宽带、电视和家庭网络服务入口。', 'Deutsche Telekom', 'https://www.telekom.de/', { providerType: 'commercial', tags: ['手机', '宽带', '网络'], price: 'paid' }),
  make('vodafone-germany', 'communication', 'Vodafone Deutschland', 'Vodafone 德国通信', '德国手机、宽带、电视和网络套餐入口。', 'Vodafone', 'https://www.vodafone.de/', { providerType: 'commercial', tags: ['手机', '宽带', '网络'], price: 'paid' }),
  make('o2-germany', 'communication', 'o2 Deutschland', 'o2 德国通信', '德国手机、移动网络和家庭宽带套餐入口。', 'Telefónica Germany', 'https://www.o2online.de/', { providerType: 'commercial', tags: ['手机', '移动网络', '宽带'], price: 'paid' }),
  make('1und1', 'communication', '1&1', '1&1 德国网络与手机', '德国移动通信、DSL 和光纤套餐入口。', '1&1', 'https://www.1und1.de/', { providerType: 'commercial', tags: ['手机', 'DSL', '光纤'], price: 'paid' }),

  // 媒体、娱乐与天气
  make('netflix-germany', 'media', 'Netflix Deutschland', 'Netflix 德国', '德国电影、电视剧和纪录片流媒体服务。', 'Netflix', 'https://www.netflix.com/de/', { providerType: 'commercial', tags: ['电影', '电视剧', '流媒体'], price: 'paid', access: 'registration' }),
  make('prime-video-germany', 'media', 'Prime Video Deutschland', 'Prime Video 德国', '德国电影、电视剧和原创内容流媒体服务。', 'Amazon', 'https://www.primevideo.com/', { providerType: 'commercial', tags: ['电影', '电视剧', '流媒体'], price: 'paid', access: 'registration' }),
  make('joyn', 'media', 'Joyn', 'Joyn 德国电视与流媒体', '德国电视直播、节目回看和流媒体内容平台。', 'Joyn', 'https://www.joyn.de/', { providerType: 'commercial', tags: ['电视', '回看', '流媒体'], languages: ['德语'] }),
  make('rtl-plus', 'media', 'RTL+', 'RTL+ 德国媒体库', '德国 RTL 电视节目、原创内容和直播入口。', 'RTL Deutschland', 'https://plus.rtl.de/', { providerType: 'commercial', tags: ['电视', '娱乐', '流媒体'], languages: ['德语'] }),
  make('spotify-germany', 'media', 'Spotify Deutschland', 'Spotify 音乐与播客', '音乐、播客和有声内容流媒体服务。', 'Spotify', 'https://www.spotify.com/de/', { providerType: 'commercial', tags: ['音乐', '播客', '音频'], price: 'freemium', access: 'registration' }),
  make('kino-de', 'media', 'KINO.de', 'KINO.de 电影信息', '德国电影上映、影院、预告片和流媒体信息。', 'KINO.de', 'https://www.kino.de/', { providerType: 'commercial', tags: ['电影', '影院', '娱乐'] }),
  make('imdb-de', 'media', 'IMDb', 'IMDb 电影与剧集资料', '查询电影、剧集、演员和评分的国际资料库。', 'IMDb', 'https://www.imdb.com/', { providerType: 'commercial', tags: ['电影', '剧集', '资料库'], languages: ['英语', '德语'] }),
  make('wetteronline', 'media', 'WetterOnline', 'WetterOnline 德国天气', '德国城市天气、预报、雷达和天气警报信息。', 'WetterOnline', 'https://www.wetteronline.de/', { providerType: 'commercial', tags: ['天气', '预报', '警报'] }),
  make('dwd-weather', 'media', 'Deutscher Wetterdienst', '德国气象局 DWD', '德国官方天气预报、警报和气象数据入口。', 'Deutscher Wetterdienst', 'https://www.dwd.de/', { providerType: 'institution', tags: ['天气', '官方', '警报'] }),

  // 外卖、食品配送与餐饮
  make('wolt-germany', 'food', 'Wolt Deutschland', 'Wolt 外卖与配送', '德国城市餐厅外卖、超市和本地配送服务。', 'Wolt', 'https://wolt.com/de/deu', { providerType: 'commercial', tags: ['外卖', '配送', '餐厅'], price: 'paid', access: 'registration' }),
  make('uber-eats-germany', 'food', 'Uber Eats Deutschland', 'Uber Eats 外卖', '德国城市餐厅外卖和食品配送平台。', 'Uber', 'https://www.ubereats.com/de', { providerType: 'commercial', tags: ['外卖', '配送', '餐厅'], price: 'paid', access: 'registration' }),
  make('too-good-to-go', 'food', 'Too Good To Go', 'Too Good To Go 剩余食物', '以较低价格购买餐厅、面包店和商店的剩余食品。', 'Too Good To Go', 'https://www.toogoodtogo.com/de', { providerType: 'commercial', tags: ['食品', '省钱', '可持续'], access: 'registration' }),
  make('flink-germany', 'food', 'Flink', 'Flink 杂货配送', '德国部分城市的日用品和食品快速配送服务。', 'Flink', 'https://www.goflink.com/de-DE/', { providerType: 'commercial', tags: ['超市', '配送', '食品'], price: 'paid', access: 'registration' }),
  make('hellofresh-germany', 'food', 'HelloFresh Deutschland', 'HelloFresh 食材包', '按菜谱配送食材包和家庭烹饪方案。', 'HelloFresh', 'https://www.hellofresh.de/', { providerType: 'commercial', tags: ['食材', '菜谱', '配送'], price: 'paid', access: 'registration' }),
  make('restaurant-guru-germany', 'food', 'Restaurant Guru Deutschland', 'Restaurant Guru 餐厅搜索', '搜索德国餐厅、菜单、评价和营业信息。', 'Restaurant Guru', 'https://de.restaurantguru.com/', { providerType: 'commercial', tags: ['餐厅', '菜单', '评价'] }),

  // 购物与德国常用零售平台
  make('amazon-germany', 'shopping', 'Amazon Deutschland', 'Amazon 德国', '德国综合电商、日用品、图书和配送服务。', 'Amazon', 'https://www.amazon.de/', { providerType: 'commercial', tags: ['电商', '日用品', '配送'], access: 'registration' }),
  make('otto', 'shopping', 'OTTO', 'OTTO 德国电商', '德国服装、家居、电子和日用品综合电商。', 'OTTO', 'https://www.otto.de/', { providerType: 'commercial', tags: ['电商', '家居', '服装'], access: 'registration' }),
  make('zalando', 'shopping', 'Zalando Deutschland', 'Zalando 德国服装', '德国服装、鞋类和配饰电商平台。', 'Zalando', 'https://www.zalando.de/', { providerType: 'commercial', tags: ['服装', '鞋类', '购物'], access: 'registration' }),
  make('about-you', 'shopping', 'ABOUT YOU', 'ABOUT YOU 德国服装', '德国服装、鞋类和生活方式电商。', 'ABOUT YOU', 'https://www.aboutyou.de/', { providerType: 'commercial', tags: ['服装', '鞋类', '购物'], access: 'registration' }),
  make('vinted-germany', 'classifieds', 'Vinted Deutschland', 'Vinted 德国二手服装', '德国二手服装、鞋包和配饰交易平台。', 'Vinted', 'https://www.vinted.de/', { providerType: 'commercial', tags: ['二手', '服装', '交易'], access: 'registration' }),
  make('mediamarkt', 'shopping', 'MediaMarkt Deutschland', 'MediaMarkt 德国电子产品', '德国电子产品、家电和数码设备零售平台。', 'MediaMarkt', 'https://www.mediamarkt.de/', { providerType: 'commercial', tags: ['电子产品', '家电', '购物'] }),
  make('saturn', 'shopping', 'Saturn Deutschland', 'Saturn 德国电子产品', '德国电子产品、电脑和家电零售平台。', 'Saturn', 'https://www.saturn.de/', { providerType: 'commercial', tags: ['电子产品', '电脑', '家电'] }),
  make('ikea-germany', 'shopping', 'IKEA Deutschland', 'IKEA 德国家居', '德国家具、家居用品和配送服务入口。', 'IKEA', 'https://www.ikea.com/de/de/', { providerType: 'commercial', tags: ['家具', '家居', '购物'] }),
  make('kaufland', 'shopping', 'Kaufland Deutschland', 'Kaufland 德国超市', '德国超市、食品、日用品和线上市场入口。', 'Kaufland', 'https://www.kaufland.de/', { providerType: 'commercial', tags: ['超市', '食品', '日用品'] }),
  make('lidl', 'shopping', 'Lidl Deutschland', 'Lidl 德国超市', '德国折扣超市、食品和家庭用品入口。', 'Lidl', 'https://www.lidl.de/', { providerType: 'commercial', tags: ['超市', '食品', '折扣'] }),
  make('aldi-sued', 'shopping', 'ALDI SÜD', 'ALDI SÜD 德国超市', '德国南部和西部常用的折扣超市信息入口。', 'ALDI SÜD', 'https://www.aldi-sued.de/', { providerType: 'commercial', tags: ['超市', '食品', '折扣'] }),
  make('aldi-nord', 'shopping', 'ALDI Nord', 'ALDI Nord 德国超市', '德国北部和东部常用的折扣超市信息入口。', 'ALDI Nord', 'https://www.aldi-nord.de/', { providerType: 'commercial', tags: ['超市', '食品', '折扣'] }),
  make('decathlon-germany', 'shopping', 'Decathlon Deutschland', 'Decathlon 德国运动用品', '德国运动服装、器材和户外用品电商及门店入口。', 'Decathlon', 'https://www.decathlon.de/', { providerType: 'commercial', tags: ['运动', '户外', '购物'] }),
  make('obi', 'shopping', 'OBI Deutschland', 'OBI 德国家居建材', '德国装修、园艺、工具和建材零售平台。', 'OBI', 'https://www.obi.de/baumarkt/', { providerType: 'commercial', tags: ['建材', '工具', '园艺'] }),
  make('hornbach', 'shopping', 'HORNBACH Deutschland', 'HORNBACH 德国建材', '德国建材、工具、装修和园艺用品平台。', 'HORNBACH', 'https://www.hornbach.de/', { providerType: 'commercial', tags: ['建材', '工具', '装修'] }),
  make('zooplus', 'shopping', 'zooplus Deutschland', 'zooplus 宠物用品', '德国宠物食品、用品和配送电商。', 'zooplus', 'https://www.zooplus.de/', { providerType: 'commercial', tags: ['宠物', '食品', '购物'] }),

  // 银行、支付与金融科技
  make('n26', 'finance', 'N26', 'N26 德国数字银行', '德国常用的手机银行、账户和银行卡服务。', 'N26', 'https://n26.com/de-de', { providerType: 'commercial', tags: ['银行', '账户', '手机银行'], price: 'freemium', access: 'registration' }),
  make('ing-germany', 'finance', 'ING Deutschland', 'ING 德国银行', '德国网上银行、储蓄、贷款和证券账户入口。', 'ING', 'https://www.ing.de/', { providerType: 'commercial', tags: ['银行', '储蓄', '贷款'], access: 'registration' }),
  make('dkb', 'finance', 'DKB', 'DKB 德国银行', '德国网上银行、账户、银行卡和贷款服务。', 'DKB', 'https://www.dkb.de/', { providerType: 'commercial', tags: ['银行', '账户', '银行卡'], access: 'registration' }),
  make('paypal-germany', 'finance', 'PayPal Deutschland', 'PayPal 德国支付', '德国线上购物常用的在线支付和转账服务。', 'PayPal', 'https://www.paypal.com/de/home', { providerType: 'commercial', tags: ['支付', '转账', '购物'], access: 'registration' }),
  make('trade-republic', 'finance', 'Trade Republic', 'Trade Republic 投资平台', '德国手机证券、储蓄和投资服务入口。', 'Trade Republic', 'https://traderepublic.com/de-de', { providerType: 'commercial', tags: ['投资', '证券', '储蓄'], access: 'registration' }),
  make('scalable-capital', 'finance', 'Scalable Capital', 'Scalable Capital 投资平台', '德国证券账户、ETF 和储蓄计划服务。', 'Scalable Capital', 'https://de.scalable.capital/', { providerType: 'commercial', tags: ['投资', 'ETF', '储蓄'], access: 'registration' }),
  make('wise-germany', 'finance', 'Wise Deutschland', 'Wise 国际转账', '国际汇款、多币种账户和跨境支付服务。', 'Wise', 'https://wise.com/de/', { providerType: 'commercial', tags: ['汇款', '多币种', '支付'], access: 'registration' }),
  make('revolut-germany', 'finance', 'Revolut Deutschland', 'Revolut 数字金融', '多币种账户、银行卡和国际支付服务。', 'Revolut', 'https://www.revolut.com/de-DE/', { providerType: 'commercial', tags: ['银行', '多币种', '支付'], access: 'registration' }),

  // 出行、租车与车辆市场
  make('share-now', 'mobility', 'Free2move SHARE NOW', 'SHARE NOW 汽车共享', '德国城市短时租车和共享汽车服务。', 'Free2move', 'https://www.free2move.com/de/de/car-sharing', { providerType: 'commercial', tags: ['共享汽车', '租车', '城市交通'], price: 'paid', access: 'registration' }),
  make('sixt-germany', 'mobility', 'SIXT Deutschland', 'SIXT 德国租车', '德国及欧洲汽车、货车和长期租赁服务。', 'SIXT', 'https://www.sixt.de/', { providerType: 'commercial', tags: ['租车', '汽车', '旅行'], price: 'paid', access: 'registration' }),
  make('cambio-carsharing', 'mobility', 'cambio CarSharing', 'cambio 汽车共享', '德国多个城市的共享汽车和按需租车服务。', 'cambio', 'https://www.cambio-carsharing.de/', { providerType: 'commercial', tags: ['共享汽车', '租车', '城市交通'], price: 'paid', access: 'registration' }),
  make('mobile-de', 'classifieds', 'mobile.de', 'mobile.de 汽车交易', '德国汽车、摩托车和商用车买卖与搜索平台。', 'mobile.de', 'https://www.mobile.de/', { providerType: 'commercial', tags: ['汽车', '二手', '交易'], access: 'registration' }),
  make('autoscout24', 'classifieds', 'AutoScout24 Deutschland', 'AutoScout24 汽车交易', '德国和欧洲汽车、摩托车买卖与估价平台。', 'AutoScout24', 'https://www.autoscout24.de/', { providerType: 'commercial', tags: ['汽车', '二手', '交易'], access: 'registration' }),

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
  ['communication', '通讯与社交媒体', '即时通讯、社交网络、创作者平台和德国网络服务。', '通讯'],
  ['media', '媒体与娱乐', '流媒体、音乐、电影、天气和日常娱乐信息。', '媒体'],
  ['food', '餐饮与配送', '外卖、食品配送、餐厅搜索和食材服务。', '餐饮'],
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
