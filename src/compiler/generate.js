const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaaa}}








function genProps (attrs) {
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === 'style') {
            let styleObj = {};
            // attr.value.split(';').forEach(item => {
            //     let [key, value] = item.split(':');
            //     obj[key] = value;
            // });
            attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
                styleObj[arguments[1]] = arguments[2];
            })
            attr.value = styleObj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`;
}

function gen(el) {
    if (el.type === 1) {
        return generate(el);
    } else{
        let text = el.text;
        if (!defaultTagRE.test(text)) {
            return `_v('${(text)}')`;
        } else {
            // 'hello' + arr + 'world'    hello {{arr}} world
            let tokens = [];
            let match;
            let lastIndex = defaultTagRE.lastIndex = 0;  // 如果正则是全局模式 需要每次使用前置为0 CSS-LOADER 原理一样
            while (match = defaultTagRE.exec(text)) { // 如果正则匹配到了 就继续匹配
                let index = match.index;    // 开始索引
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)));
                }
                tokens.push(`_s(${match[1].trim()})`);
                lastIndex = index + match[0].length;
            }
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)));
            }
            return `_v(${tokens.join('+')})`;
        }
    }
}

function genChildren (el) { // _c('div',{id:"app",a:"1",style:{"color":" red"," background":" lightblue"}},_v("hello"+_s(attr)+"world"))
    let children = el.children;
    if (children) {
        return children.map(c => gen(c)).join(',');
    }
    return false;
}


export function generate (el) {
    // console.log('--------', el)

    // 遍历树 将树拼接成字符串
    let children = genChildren(el);
    let code = `_c('${el.tag}',${el.attrs.length? genProps(el.attrs) : 'undefined'}${children? `,${children}` : ''})`;

    return code;
}