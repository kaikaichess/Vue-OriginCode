const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;

const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签开头，例: <div
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配到的分组是结束标签，例: </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性
const startTagClose = /^\s*(\/?)>/; // 匹配开始标签的结束，例: > 或 />
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配插值, 例: {{xxx}}; 其匹配到的内容就是我们表达式的变量

function parseHTML(html) {
    // 传进来的形参html开头肯定是"<"

    function advance(n) {
        // 将匹配完的字段截取掉
        html = html.substring(n);
    }

    function parseStartTag() {
        // 解析开始标签

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
                match.attrs.push({ name: attr[1], value: attr[3 || attr[4] || attr[5]] })
                console.log(match);
            }

            if (end) {
                // 如果是开始标签的结束
                advance(end[0].length);
            }
        }
        return false; // 没匹配到说明不是开始标签
    }

    while (html) {
        // textEnd = 0说明是一个开始标签或结束标签，<div>hello</div> 或 </div>
        // textEnd > 0说明是文本的结束位置，hello</div>
        let textEnd = html.indexOf("<");
        if (textEnd == 0) {
            parseStartTag();
            break;
        }
    }
}

// 对模板进行编译
export function compileToFunction(template) {
    // 将template转化成ast语法树
    let ast = parseHTML(template);
    // 生成render方法(render方法返回的结果就是虚拟DOM)
}
