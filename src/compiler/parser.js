const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //  用来获取的标签名的 match后的索引为1的
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签的
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配闭合标签的
//           aa  =   "  xxx "  | '  xxxx '  | xxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // a=b  a="b"  a='b'
const startTagClose = /^\s*(\/?)>/; //     />   <div/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaaa}}


// 将解析后的结果 组装成一个树结构  parent  children 用对象来描述节点 栈结构以及标签闭合时弹出确定父子关系

function createAstElement(tagName, attrs) {
    return {
        tag: tagName,
        type: 1, // 元素类型 1 文本 3
        children: [],
        attrs,
        parent: null
    }
}

let root = null;
let stack = [];

function start(tagName, attrs) {
    // console.log('开始标签：', tagName, '属性是：', attrs);
    let parent = stack[stack.length - 1];
    let element = createAstElement(tagName, attrs);
    if (!root) {
        root = element;
    }
    element.parent = parent;
    if (parent) {
        parent.children.push(element);
    }
    stack.push(element);
}

function end(tagName) {
    // console.log('结束标签：', tagName);
    let last = stack.pop();
    if (last.tag !== tagName) {
        throw new Error('标签闭合有误');
    }
}

function chars(text) {
    // console.log('文本是：', text);
    text = text.replace(/\s/g, ''); // 去掉空格
    let parent = stack[stack.length - 1];
    if (text) {
        parent.children.push({
            type: 3,
            text
        })
    }
}

export function parserHTML(html) {

    function advance(len) {
        html = html.substring(len);
    }

    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length);
            // console.log(html)
            let end, attr; // 如果没有遇到标签结尾就不停的解析
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                // console.log(attr)
                advance(attr[0].length); // 将属性去掉
                match.attrs.push({name: attr[1], value: attr[3] || attr[4] || attr[5]})
            }
            // console.log(html)
            if(end) {
                advance(end[0].length);
            }
            return match;
        }
        return false;
    }

    while (html) { // 只要html不为空字符串就一直解析
        let textEnd = html.indexOf('<');
        if (textEnd === 0) {
            const startTagMatch = parseStartTag(); // 通过这个方法获取到匹配的结果 tagName, attrs 解析开始标签

            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            const endTagMatch = html.match(endTag) // 解析结束标签

            if (endTagMatch) {
                end(endTagMatch[1]);
                advance(endTagMatch[0].length);
            }
        }
        let text; // 用来存储当前文本   xxx></div>
        if (textEnd > 0) {
            text = html.substring(0, textEnd);
        }
        if (text) {
            advance(text.length);
            chars(text);
        }
    }
    return root;
}