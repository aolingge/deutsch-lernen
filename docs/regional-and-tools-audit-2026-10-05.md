# 德国区域交通与数字工具补充检查

检查日期：2026-10-05。新增 23 项原站入口，并为 9 个已有平台补充经官方页面确认的应用标签。源码 430 项 / 28 类；公开快照 353 项，其中 106 项可通过应用筛选找到（筛选优先使用 mediaTypes，未设置时采用 formats）。

## 发现与处理

- 区域交通缺口：补充汉堡、莱茵鲁尔、莱茵美因、柏林勃兰登堡和斯图加特交通应用；不把区域服务写成德国全境可用。
- 停车与自行车：补充 EasyPark、Parkster、Donkey Republic 和 Call a Bike，说明费用及覆盖范围需查原站。已有 Swapfiets 不重复收录。
- 图书馆资源：补充 Onleihe、Libby 和 filmfriend，明确需要参与图书馆的有效账户或借阅证；会员费用、居住地限制和馆藏以所属图书馆为准。
- 办公与通讯：补充浏览器、邮件客户端、笔记、办公和会议软件，仍以导航为主，不增加学习教学流程。
- 原站地址核验发现规划中的 EasyPark、Zoom 和 FlixBus 下载路径已变化：发布前改用当前官方入口。
- 桌面分类列表较长时，当前分类会落到可视范围外：只滚动分类栏，使选中项可见；不改变整页位置。
- 32 项增量链接检查：30 ok、1 restricted（REWE HTTP 403）、1 unchecked（VVS 超时）。VVS 在另一次严格 TLS 请求中证书验证失败，未绕过验证。原始报告保留，未把未核实当失效。

## 新增原站索引

| 分类 | 来源 | 形式 | 自动链接结果 |
| --- | --- | --- | --- |
| 交通与出行 | [hvv](https://www.hvv.de/de/app) | 网页 / 应用 | ok |
| 交通与出行 | [VRR](https://www.vrr.de/fahrplan-mobilitaet/vrr-app/) | 网页 / 应用 | ok |
| 交通与出行 | [RMV](https://www.rmv.de/c/de/tickets/kauf/app-rmvgo) | 网页 / 应用 | ok |
| 交通与出行 | [VBB](https://www.vbb.de/unterwegs-im-vbb/fahrplanauskunft-in-app-web/vbb-app-bus-bahn/) | 网页 / 应用 | ok |
| 交通与出行 | [VVS](https://www.vvs.de/hilfe-faq/apps-dienste) | 网页 / 应用 | unchecked |
| 交通与出行 | [EasyPark](https://www.easypark.com/de) | 网页 / 应用 | ok |
| 交通与出行 | [Parkster](https://www.parkster.com/de/) | 网页 / 应用 | ok |
| 交通与出行 | [Donkey Republic](https://www.donkey.bike/de/) | 网页 / 应用 | ok |
| 交通与出行 | [Call a Bike](https://www.callabike.de/de/get-the-app) | 网页 / 应用 | ok |
| 媒体与娱乐 | [Onleihe](https://eausleihe.onleihe.de/) | 网页 / 应用 | ok |
| 媒体与娱乐 | [OverDrive / Libby](https://libbyapp.com/) | 网页 / 应用 | ok |
| 媒体与娱乐 | [filmfriend](https://www.filmfriend.de/de/) | 网页 / 应用 | ok |
| 应用与数字工具 | [Mozilla / Firefox](https://www.firefox.com/de/) | 网页 / 应用 | ok |
| 应用与数字工具 | [Thunderbird](https://www.thunderbird.net/de/) | 网页 / 应用 | ok |
| 应用与数字工具 | [Microsoft](https://www.microsoft.com/de-de/microsoft-365) | 网页 / 应用 | ok |
| 应用与数字工具 | [Google](https://workspace.google.com/intl/de/) | 网页 / 应用 | ok |
| 应用与数字工具 | [Obsidian](https://obsidian.md/download) | 网页 / 应用 | ok |
| 应用与数字工具 | [Jitsi Meet](https://meet.jit.si/) | 网页 / 应用 | ok |
| 应用与数字工具 | [Zoom](https://www.zoom.us/download/) | 网页 / 应用 | ok |
| 应用与数字工具 | [Microsoft](https://www.microsoft.com/de-de/microsoft-teams/group-chat-software) | 网页 / 应用 | ok |
| 通讯与社交媒体 | [Threema](https://threema.com/de/download/threema-private) | 网页 / 应用 | ok |
| 旅行与短住 | [HRS](https://www.hrs.de/) | 网页 | ok |
| 应用与数字工具 | [Joplin](https://joplinapp.org/) | 网页 / 应用 | ok |

## 已有条目的应用核验来源

| 条目 | 官方应用依据 |
| --- | --- |
| Swapfiets | [官方应用页面](https://swapfiets.de/) |
| FlixBus | [官方应用页面](https://www.flixbus.de/service/fernbus-app) |
| dm-drogerie markt | [官方应用页面](https://www.dm.de/services/unsere-apps/dm-app) |
| ROSSMANN | [官方应用页面](https://www.rossmann.de/de/service-und-hilfe/rossmann-app) |
| REWE | [官方应用页面](https://www.rewe.de/service/app/) |
| Deutsche Bahn International | [官方应用页面](https://www.bahn.de/service/mobile/db-navigator) |
| Discord | [官方应用页面](https://discord.com/download) |
| Mastodon | [官方应用页面](https://joinmastodon.org/apps) |
| Spotify Deutschland | [官方应用页面](https://www.spotify.com/de/download/windows/) |

## 验证边界

本轮检查覆盖新增资源和本轮修改的已有条目；上一轮全目录 HTTP 报告仍属于历史证据。图标仅作为来源标识，提供商保留商标权。资源收录不代表购买推荐，也不代表所有功能、资格或收费已经完整验证。

## 详情页查询与检查工具

全量发布检查连续两次发现部分详情响应 HTTP 503；单条顺序复核 24 次均为 200，因此尚不能把原因认定为某个资源链接错误。检查发现详情路由每次读取并验证全部公开目录，现改为通过已有唯一 slug 索引查询当前条目，不增加缓存或数据库结构变更。公开状态、元数据验证、内部证据剥离和数据库不可用时 503 的行为保持一致。依据 [Cloudflare D1 索引说明](https://developers.cloudflare.com/d1/best-practices/use-indexes/)，索引查找可减少读取范围；具体 503 原因尚未由服务端日志证实。

发布检查现在在失败记录中写明 HTTP 状态、标题匹配和 noindex 状态，避免把服务错误误报为内容错误。首次和第二次失败报告保留在本地忽略目录；最终检查另行记录。

最终版本 `795773b9-4efc-499f-85bb-912f6732eb0a` 已上线。44 项测试通过，Astro 无错误/警告/提示，371 页构建成功。线上三浏览器日常流程通过，32 条变更记录回读一致，317 张图标哈希一致；最终保持四并发检查全部 353 个详情页、完整站点地图及 1200x630 分享图，未发现失败。索引查询计划已在现有迁移结构上验证。自动隐私扫描仍有 73 项号码形态匹配，实际新增匹配来自公开图标资产标识；其他匹配沿用已有上下文复核，不宣称扫描全绿。
