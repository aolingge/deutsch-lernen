# Deutsch Lernen

一个面向中文学习者的公开德语学习仓库，目标是把德语语言学习、B1 备考、德国生活常识和长期学习方法整理成可复用的开源知识库。

> Status: early public scaffold. 内容会持续补全，但仓库只收录可公开、已脱敏、可复用的资料。

## 适合谁

- 正在从 A1/A2 过渡到 B1 的德语学习者
- 需要准备 Goethe-Zertifikat B1、DTZ 或类似 B1 考试的人
- 想了解德国生活、学习、工作、行政办事常识的人
- 想把零散德语笔记整理成长期学习系统的人

## 内容地图

- [B1 学习路线](docs/learning-paths/b1-roadmap.md)
- [核心语法](docs/grammar/core-grammar.md)
- [冠词、格和代词](docs/grammar/cases-and-pronouns.md)
- [动词时态和情态动词](docs/grammar/verb-tenses-and-modals.md)
- [B1 必考从句](docs/grammar/subordinate-clauses.md)
- [主题词汇](docs/vocabulary/theme-vocabulary.md)
- [听力与阅读高频词汇](docs/vocabulary/listening-reading-core-vocabulary.md)
- [B1 固定搭配](docs/vocabulary/collocations.md)
- [B1 考试备考](docs/exam/b1-exam-guide.md)
- [听力解题策略](docs/exam/listening-strategy.md)
- [阅读解题策略](docs/exam/reading-strategy.md)
- [写作模板](docs/exam/writing-templates.md)
- [口语模板](docs/exam/speaking-templates.md)
- [德国生活指南](docs/life-in-germany/README.md)
- [预约与办事表达](docs/life-in-germany/appointments-and-offices.md)
- [公开学习资源](docs/resources/public-resources.md)
- [本地资源整理记录](docs/resources/import-log.md)
- [隐私与脱敏规则](PRIVACY.md)
- [贡献指南](CONTRIBUTING.md)

## 维护原则

1. 先实用，再完整：每篇内容都尽量给例句、场景和常见错误。
2. 中文解释优先：新概念先用普通话解释清楚，再给德语术语。
3. 不上传私人资料：课堂记录、个人经历、账号信息、聊天记录、截图原图等不进入公开仓库。
4. 只收录可公开材料：引用外部资料时优先链接官方来源，不复制受版权保护的大段内容。
5. 自动化要保守：定时任务只能整理和重写脱敏后的通用内容，不能直接发布本地原始笔记。

## 本地资源如何进入公开仓库

本仓库默认不接收原始资源。推荐流程：

1. 在本地私有目录整理原始资料。
2. 用 [tools/privacy-scan.ps1](tools/privacy-scan.ps1) 扫描候选 Markdown。
3. 把内容改写成通用知识点，删除姓名、联系方式、账号、地址、私人链接、课堂群信息和个人经历细节。
4. 只提交改写后的 Markdown。

## License

- 文档内容使用 [CC BY 4.0](LICENSE-CONTENT.md)。
- 脚本和仓库辅助代码使用 [MIT](LICENSE-CODE.md)。
