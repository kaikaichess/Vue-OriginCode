const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;

const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签开头，例: <div
const startTagClose = /^\s*(\/?)>/; // 匹配开始标签的结束，例: > 或 />
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配到的分组是结束标签，例: </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配插值, 例: {{xxx}}; 其匹配到的内容就是我们表达式的变量

function parseHTML(html) {
    // 传进来的形参html开头肯定是"<"

    const ELEMENT_TYPE = 1  // 定义元素类型为1
    const TEXT_TYPE = 3  // 定义文本类型为3
    const stack = []  //用于存放元素的 栈
    let currentParent  // 指针，指向栈顶元素
    let root  // 语法树根节点

    function createASTElement(tag, attrs) {  // ast语法树
        return {
            tag,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }

    function start(tag, attrs) {
        let node = createASTElement(tag, attrs)  // 生成一个ast节点
        if(!root) {  // 判断是否为空树，若为空，则节点为根节点
            root = node
        }
        if(currentParent) {
            node.parent = currentParent
            currentParent.children.push(node)
        }
        stack.push(node)
        currentParent = node  // 指针指向栈顶元素
    }

    function chars(text) {
        text = text.replace(/\s/g, '')  // 如果文本为超过2个的空格，则删除
        text && currentParent.children.push({
            type: TEXT_TYPE,
            text,
            parent: currentParent
        })
    }

    function end(tag) {
        stack.pop()  // 将栈顶元素弹出
        currentParent = stack[stack.length - 1]
    }

    function advance(n) {
        // 将匹配完的字段截取掉
        html = html.substring(n);
    }

    function parseStartTag() {  // 解析开始标签

        const start = html.match(startTagOpen); // 开始进行匹配

        if (start) {
            // 匹配到了说明是开始标签
            const match = {
                tagName: start[1], // 标签名
                attrs: [],
            };
            advance(start[0].length);

            // 如果匹配的结果不是开始标签的结束就一直匹配(意味是属性)，并且把每次匹配到的结果(属性)保留下来
            let attr, end;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length);
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] || true})
            }

            if (end) {
                // 如果是开始标签的结束
                advance(end[0].length);
            }

            return match
        }
        return false; // 没匹配到说明不是开始标签
    }

    while (html) {
        // textEnd = 0说明是一个开始标签或结束标签，<div>hello</div> 或 </div>
        // textEnd > 0说明是文本的结束位置，hello</div>
        let textEnd = html.indexOf("<");
        if (textEnd == 0) {  // 处理标签
            let startTagMatch = parseStartTag();
            if(startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue  // 如果有开始标签则跳过本轮操作
            }
            let endTagMatch = html.match(endTag)
            if(endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }

        if (textEnd > 0) {  // 处理文本
            let text = html.substring(0, textEnd)  // 截取文本
            if(text) {
                chars(text)
                advance(text.length)
            }
        }
    }
    console.log(root);
}

// 对模板进行编译
export function compileToFunction(template) {
    // 将template转化成ast语法树
    let ast = parseHTML(template);
    // 生成render方法(render方法返回的结果就是虚拟DOM)
}
