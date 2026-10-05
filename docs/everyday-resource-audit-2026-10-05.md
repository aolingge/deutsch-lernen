# 德国日常资源扩展检查

检查日期：2026-10-05。新增 76 项原站入口，公开目录从 254 项扩至 330 项，65 个条目标有官方客户端或应用；源码另保留原创及归档记录，总数 407。分类从 25 增至 28。

## 本轮发现与处理

- 生活资源与语言资源混在一起：分类导航分为德国生活与应用、德语学习与媒体。桌面分类可滚动，手机保留展开全部分类。
- 应用藏在高级筛选：形式与费用放在主筛选，等级放入更多筛选。官方客户端已核实的 WhatsApp、Signal、Telegram 补充应用标签。
- 快递、能源、家庭服务与休闲缺口：新增三个分类，并补充医保应用、政务身份、官方预警、地图、充电、税务、邮箱与密码管理入口。
- Omio 的相似 .de 域名返回无关 WordPress 页面：改用提供商官方 .com 地址，并移除错误站点图标。HTTP 200 不等于资源正确。
- OBI 自动 HTTP 返回 404，但隔离浏览器返回 200 且展示正确官方内容：保留原官方网址，标注自动访问受限，不把它误删。
- UPS 返回 HTTP 200 的 Access Denied 页面：手动记为 restricted。其他挑战、登录及限流页面不算完成内容核验。
- 窄屏切换时分类条可能看不到当前分类：增加断点切换时定位，并检查 320px / 200% 文字。

## 收录与核验范围

资源介绍依据提供商主页、官方产品页和官方应用信息；只提供原站链接，不复制第三方内容。收费、服务城市、医保资格、账户和软件支持范围以原站为准。费用不清晰的条目保留待核实，不把免费访问主页误写成免费服务。部分网站限制自动访问，所以编辑状态保持 partial，不声称全部功能已验证。

已有 254 项和新增 76 项均进入本轮链接审查。自动报告保留原始结果；浏览器复核和页面内容判读另行记录，避免为了零失败修改检测结果。没有穷尽德国全部网站，也没有把金融、保险或医疗平台列成购买建议。

## 新增资源清单

| 分类 | 平台与原站 | 形式 | 链接状态 |
| --- | --- | --- | --- |
| 邮政与快递 | [Post & DHL](https://www.dhl.de/de/privatkunden/kampagnenseiten/dhl-app.html) | 网页 / 应用 | ok |
| 邮政与快递 | [DPD](https://www.dpd.com/de/de/empfangen/dpd-app/) | 网页 / 应用 | ok |
| 邮政与快递 | [Hermes](https://www.myhermes.de/) | 网页 / 应用 | ok |
| 邮政与快递 | [GLS](https://www.gls-pakete.de/) | 网页 / 应用 | restricted |
| 邮政与快递 | [UPS](https://www.ups.com/de/de/home) | 网页 / 应用 | restricted |
| 能源与家庭服务 | [E.ON](https://www.eon.de/de/pk.html) | 网页 | restricted |
| 能源与家庭服务 | [EnBW](https://www.enbw.com/) | 网页 | ok |
| 能源与家庭服务 | [Vattenfall](https://www.vattenfall.de/) | 网页 | restricted |
| 能源与家庭服务 | [Octopus Energy](https://octopusenergy.de/) | 网页 | ok |
| 能源与家庭服务 | [Bundesnetzagentur](https://www.bundesnetzagentur.de/DE/Vportal/Energie/start.html) | 网页 | ok |
| 能源与家庭服务 | [MyHammer](https://www.my-hammer.de/) | 网页 | restricted |
| 能源与家庭服务 | [Taskrabbit](https://www.taskrabbit.de/) | 网页 / 应用 | ok |
| 休闲与运动 | [EVENTIM](https://www.eventim.de/) | 网页 / 应用 | unchecked |
| 休闲与运动 | [Eventbrite](https://www.eventbrite.de/) | 网页 / 应用 | ok |
| 休闲与运动 | [komoot](https://www.komoot.com/de-de) | 网页 / 应用 | ok |
| 休闲与运动 | [AllTrails](https://www.alltrails.com/de/) | 网页 / 应用 | restricted |
| 休闲与运动 | [Strava](https://www.strava.com/) | 网页 / 应用 | ok |
| 休闲与运动 | [Urban Sports Club](https://urbansportsclub.com/de) | 网页 / 应用 | ok |
| 休闲与运动 | [Deutscher Alpenverein](https://www.alpenverein.de/) | 网页 | ok |
| 媒体与娱乐 | [Disney+](https://www.disneyplus.com/de-de) | 网页 / 应用 | ok |
| 媒体与娱乐 | [Steam](https://store.steampowered.com/?l=german) | 网页 / 应用 | ok |
| 媒体与娱乐 | [Epic Games Store](https://store.epicgames.com/de/) | 网页 / 应用 | restricted |
| 旅行与短住 | [Airbnb](https://www.airbnb.de/) | 网页 / 应用 | ok |
| 旅行与短住 | [Omio](https://www.omio.com/) | 网页 / 应用 | restricted |
| 旅行与短住 | [Trainline](https://www.thetrainline.com/de) | 网页 / 应用 | ok |
| 旅行与短住 | [GetYourGuide](https://www.getyourguide.de/) | 网页 / 应用 | restricted |
| 旅行与短住 | [Deutsches Jugendherbergswerk](https://www.jugendherberge.de/) | 网页 | ok |
| 旅行与短住 | [PiNCAMP](https://www.pincamp.de/) | 网页 | ok |
| 交通与出行 | [Google Maps](https://www.google.com/maps) | 网页 / 应用 | ok |
| 交通与出行 | [HERE WeGo](https://wego.here.com/) | 网页 / 应用 | ok |
| 交通与出行 | [Waze](https://www.waze.com/de/) | 网页 / 应用 | restricted |
| 交通与出行 | [BlaBlaCar](https://www.blablacar.de/) | 网页 / 应用 | restricted |
| 交通与出行 | [Uber](https://www.uber.com/de/de/) | 网页 / 应用 | unchecked |
| 交通与出行 | [Bolt](https://bolt.eu/de-de/) | 网页 / 应用 | ok |
| 交通与出行 | [FREENOW](https://www.free-now.com/de/) | 网页 / 应用 | restricted |
| 交通与出行 | [ADAC Drive](https://www.adac.de/services/apps/drive/) | 网页 / 应用 | ok |
| 交通与出行 | [EnBW mobility+](https://www.enbw.com/elektromobilitaet/produkte/mobilityplus-app) | 网页 / 应用 | ok |
| 政府与办事 | [BundID](https://id.bund.de/de) | 网页 | ok |
| 政府与办事 | [Bundesamt für Bevölkerungsschutz](https://www.bbk.bund.de/DE/Warnung-Vorsorge/Warn-App-NINA/warn-app-nina_node.html) | 网页 / 应用 | ok |
| 政府与办事 | [Familienportal des Bundes](https://familienportal.de/) | 网页 | ok |
| 医疗与健康 | [Techniker Krankenkasse](https://www.tk.de/techniker/versicherung/krankenkasse-anliegen-online-erledigen/tk-app-2027886) | 网页 / 应用 | ok |
| 医疗与健康 | [AOK](https://meine.aok.de/) | 网页 / 应用 | ok |
| 医疗与健康 | [BARMER](https://www.barmer.de/unsere-leistungen/leistungen-a-z/meine-barmer) | 网页 / 应用 | ok |
| 医疗与健康 | [gematik](https://www.das-e-rezept-fuer-deutschland.de/app) | 网页 / 应用 | ok |
| 医疗与健康 | [aponet.de](https://www.aponet.de/apotheke/notdienstsuche) | 网页 | ok |
| 购物与日常 | [EDEKA](https://www.edeka.de/) | 网页 / 应用 | restricted |
| 购物与日常 | [PENNY](https://www.penny.de/) | 网页 / 应用 | ok |
| 购物与日常 | [Netto Marken-Discount](https://www.netto-online.de/) | 网页 / 应用 | restricted |
| 购物与日常 | [mydealz](https://www.mydealz.de/) | 网页 / 应用 | restricted |
| 购物与日常 | [refurbed](https://www.refurbed.de/) | 网页 | ok |
| 购物与日常 | [Back Market](https://www.backmarket.de/de-de) | 网页 / 应用 | unchecked |
| 购物与日常 | [Fressnapf](https://www.fressnapf.de/) | 网页 / 应用 | ok |
| 购物与日常 | [Tchibo](https://www.tchibo.de/) | 网页 / 应用 | ok |
| 餐饮与配送 | [Picnic](https://picnic.app/de/) | 网页 / 应用 | ok |
| 餐饮与配送 | [Knuspr](https://www.knuspr.de/) | 网页 / 应用 | restricted |
| 餐饮与配送 | [Chefkoch](https://www.chefkoch.de/) | 网页 / 应用 | restricted |
| 餐饮与配送 | [TheFork](https://www.thefork.de/) | 网页 / 应用 | restricted |
| 通讯与社交媒体 | [Bluesky](https://bsky.app/) | 网页 / 应用 | ok |
| 通讯与社交媒体 | [Threads](https://www.threads.com/) | 网页 / 应用 | ok |
| 通讯与社交媒体 | [X](https://x.com/) | 网页 / 应用 | ok |
| 通讯与社交媒体 | [Snapchat](https://www.snapchat.com/) | 网页 / 应用 | ok |
| 通讯与社交媒体 | [Pinterest](https://www.pinterest.de/) | 网页 / 应用 | ok |
| 通讯与社交媒体 | [GMX](https://www.gmx.net/) | 网页 / 应用 | ok |
| 通讯与社交媒体 | [WEB.DE](https://web.de/) | 网页 / 应用 | ok |
| 通讯与社交媒体 | [Proton Mail](https://proton.me/de/mail) | 网页 / 应用 | ok |
| 金融与保险 | [Sparkasse](https://www.sparkasse.de/) | 网页 / 应用 | ok |
| 金融与保险 | [Volksbanken Raiffeisenbanken](https://www.vr.de/) | 网页 / 应用 | ok |
| 金融与保险 | [Allianz](https://www.allianz.de/) | 网页 | restricted |
| 金融与保险 | [HUK-COBURG](https://www.huk.de/) | 网页 | ok |
| 金融与保险 | [Taxfix](https://taxfix.de/) | 网页 / 应用 | ok |
| 金融与保险 | [Buhl](https://www.buhl.de/steuer/) | 网页 / 应用 | ok |
| 应用与数字工具 | [Bitwarden](https://bitwarden.com/) | 网页 / 应用 | ok |
| 应用与数字工具 | [Notion](https://www.notion.com/de) | 网页 / 应用 | ok |
| 应用与数字工具 | [The Document Foundation](https://de.libreoffice.org/) | 网页 / 应用 | ok |
| 应用与数字工具 | [Nextcloud](https://nextcloud.com/) | 网页 / 应用 | ok |
| 应用与数字工具 | [Bundesnetzagentur](https://www.breitbandmessung.de/desktop-app) | 网页 / 应用 | ok |

## 代表性官方依据

- [DHL 官方应用](https://www.dhl.de/de/privatkunden/kampagnenseiten/dhl-app.html)、[DPD 官方应用](https://www.dpd.com/de/de/empfangen/dpd-app/)、[NINA 官方预警](https://www.bbk.bund.de/DE/Warnung-Vorsorge/Warn-App-NINA/warn-app-nina_node.html)。
- [Omio 官方服务说明](https://www.omio.com/how-it-works)、[WhatsApp 官方下载](https://www.whatsapp.com/download/)、[Signal 官方下载](https://signal.org/download/)、[Telegram 官方应用](https://www.telegram.org/apps?setln=de)。
- [联邦网络局测速工具](https://www.breitbandmessung.de/desktop-app)、[BundID](https://id.bund.de/de)、[官方电子处方应用](https://www.das-e-rezept-fuer-deutschland.de/app)。

## 筛选计算优化

原实现对每个来源选项反复扫描目录，表单同步和渲染还重复计算同一组筛选。改为每种筛选一次累加，并复用相同查询、去除不影响数量的排序与分页。组合条件、收藏、缺失来源和分页均与旧定义逐项比较。330 项资源的本机微基准中位数从 20.10 ms 降为 1.20 ms；这是计算函数测量，不是所有用户设备的加载速度保证。
