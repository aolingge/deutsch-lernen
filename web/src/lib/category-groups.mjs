const language = new Set(['courses','exams','vocabulary','grammar','listening','speaking','reading','writing','news','video']);
const everydayOrder = ['communication','shopping','classifieds','food','housing','household','postal','mobility','finance','health','government','jobs','social','travel','leisure','media','tools','life'];
/** Keep every category reachable, including future categories. @param {{id:string,name:string}[]} categories */
export function directoryGroups(categories) {
  const everyday = categories.filter(c=>!language.has(c.id)).sort((a,b)=>{
    /** @param {string} id */
    const rank = (id) => everydayOrder.includes(id) ? everydayOrder.indexOf(id) : everydayOrder.length;
    return rank(a.id)-rank(b.id);
  });
  return [{name:'德国生活与应用',categories:everyday},{name:'德语学习与媒体',categories:categories.filter(c=>language.has(c.id))}];
}
