import { readFile } from 'node:fs/promises';

// Use the running dictionary's own document view. No tokens or cookies are read.
const targets = await (await fetch('http://127.0.0.1:18884/json')).json();
const target = targets.find(item => process.env.EUDIC_TARGET_ID ? item.id === process.env.EUDIC_TARGET_ID : item.title === (process.env.EUDIC_VIEW_TITLE || '文件阅读'));
if (!target) throw new Error('德语助手的文件阅读窗口未打开');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});
let nextId = 0;
const pending = new Map();
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
});
const call = (method, params) => new Promise(resolve => {
  const id = ++nextId;
  pending.set(id, resolve);
  socket.send(JSON.stringify({ id, method, params }));
});
const timer = setTimeout(() => { socket.close(); process.exitCode = 1; console.error('App 操作超时'); }, 45000);
try {
  if (process.argv[2] === '--wake') {
    console.log(JSON.stringify(await call('Debugger.enable', {})));
    console.log(JSON.stringify(await call('Debugger.resume', {})));
    console.log(JSON.stringify(await call('Page.setWebLifecycleState', {state:'active'})));
    console.log(JSON.stringify(await call('Emulation.setFocusEmulationEnabled', {enabled:true})));
  } else {
  if (process.env.EUDIC_INSPECT_FOLIATE === '1') {
    const prototype = await call('Runtime.evaluate', { expression: 'window.foliateModule.q.prototype' });
    const objects = await call('Runtime.queryObjects', { prototypeObjectId: prototype.result.result.objectId });
    await call('Runtime.callFunctionOn', {
      objectId: objects.result.objects.objectId,
      functionDeclaration: 'function(){window.activeReader=this.find(item=>item.htmlExporter)||this[0];return !!window.activeReader;}',
      returnByValue: true
    });
  }
  if (process.argv[2] === '--upload') {
    const document = await call('DOM.getDocument', {});
    const input = await call('DOM.querySelector', { nodeId: document.result.root.nodeId, selector: 'input[type="file"]' });
    if (!input.result.nodeId) throw new Error('App 当前窗口没有文件导入控件');
    const response = await call('DOM.setFileInputFiles', { nodeId: input.result.nodeId, files: [process.argv[3]] });
    if (response.error) throw new Error(JSON.stringify(response.error));
    console.log('已通过 App 文件控件导入');
  } else {
  if (process.env.EUDIC_INSPECT_EXPORT === '1') {
    const prototype = await call('Runtime.evaluate', { expression: 'window.eudicModule.t.prototype' });
    const objects = await call('Runtime.queryObjects', { prototypeObjectId: prototype.result.result.objectId });
    await call('Runtime.callFunctionOn', {
      objectId: objects.result.objects.objectId,
      functionDeclaration: 'function(){window.activeExport=this.find(item=>item.isSavingDocument&&!item.abortController?.signal.aborted)||this.find(item=>!item.abortController?.signal.aborted)||this[0];return !!window.activeExport;}',
      returnByValue: true
    });
  }
  const expression = process.argv[2] === '--file' ? await readFile(process.argv[3], 'utf8') : process.argv[2];
  const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.error || response.result?.exceptionDetails) throw new Error(JSON.stringify(response.error || response.result.exceptionDetails));
  console.log(JSON.stringify(response.result.result.value, null, 2));
  }
  }
} finally {
  clearTimeout(timer);
  socket.close();
}
