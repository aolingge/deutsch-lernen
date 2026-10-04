(() => {
  const runner = window.activeReader.htmlExporter.translationRunner;
  const prototype = Object.getPrototypeOf(runner);
  if (prototype.__readerOriginalTextList) return '已启用本次会话的批量导出';
  prototype.__readerOriginalTextList = prototype.translateTextList;
  prototype.translateTextList = async function (texts, skipped, signal, progress) {
    const info = await this.translateService.fetchCurrentEngineInfoOnce();
    if (signal.aborted) return this.buildResult(texts, new Map(), skipped);
    if (!info.supportsBatchTranslation) {
      return prototype.__readerOriginalTextList.call(this, texts, skipped, signal, progress);
    }
    const batches = this.splitBatch(texts,
      info.isLLMEngine ? this.llmBatchMaxCount : this.batchMaxCount,
      info.isLLMEngine ? this.llmBatchMaxChars : this.batchMaxChars);
    const translations = new Map();
    let next = 0;
    let done = 0;
    const worker = async () => {
      while (!signal.aborted && next < batches.length) {
        const batch = batches[next++];
        try {
          const responses = await this.withTimeout(this.translateService.batchTranslateOnce(batch));
          if (responses.length === batch.length) {
            responses.forEach((response, index) => this.setTranslationFromResponse(translations, batch[index], response));
          }
        } catch (_) {
          // Keep incomplete paragraphs visible in the app's existing export stats.
        }
        done += batch.length;
        if (progress) progress(100 * done / texts.length, done, texts.length);
      }
    };
    // Use the app's existing service, engine and batch limits; no external API,
    // account changes or recharge. Bound concurrency below its normal limit 10.
    await Promise.all(Array.from({length: Math.min(4, this.concurrency || 4, batches.length)}, worker));
    return this.buildResult(texts, translations, skipped);
  };
  return '本次会话使用 App 现有引擎及批量接口，最多同时处理 4 个批次';
})()
