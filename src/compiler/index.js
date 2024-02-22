import { parserHTML } from "./parser";
import {generate} from "./generate";


export function compileToFunction(template) {

    let root = parserHTML(template);
    // console.log(root, 'root');

    // 生成代码
    let code = generate(root);

    let render = new Function(`with(this){return ${code}}`);
    
    return render;

    // console.log(render.toString());

    // html => ast(只能描述语法 语法不存在的属性无法描述) => render函数 + (with + new Function) => 虚拟DOM(增加额外的属性) => 生成真实DOM
}