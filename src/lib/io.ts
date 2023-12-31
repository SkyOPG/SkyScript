import { 
    NumberValue, 
    StringValue, 
    BooleanValue, 
    NullValue,
    FunctionValue,
    Runtime
} from "../runtime/val.js";
import util from 'node:util';
import { question } from 'readline-sync';
import { execSync } from "node:child_process";
import Environment from "../runtime/env.js";
import { evaluate } from "../runtime/index.js";

export default ({ makeStr, library, makeNull }) => {
    library.createFunction("out", (args, _scope) => {
        const log: any[] = []
    
        for (const arg of args) {
            switch (arg.type) {
                case 'number':
                    log.push(((arg as NumberValue).value))
                continue
                case 'string':
                    log.push((arg as StringValue).value)
                continue
                case 'boolean':
                    log.push(((arg as BooleanValue).value))
                continue
                case 'null':
                    log.push(((arg as NullValue).value))
                continue
                default:
                    log.push(arg)
            }
        }
            const be42log = util.format.apply(this, log);
            console.log(be42log)
    
        return makeStr(be42log);
    });

    library.createFunction("ask", (args, _scope) => {
        const log: string[] = []
    
        for (const arg of args) {
            switch (arg.type) {
                case 'string':
                    log.push((arg as StringValue).value)
                continue
                default:
                    log.push(arg)
            }
        }

        return makeStr(question(util.format.apply(this, log) || "> "));
    });

    library.createFunction("wait", function(args, _scope){
        const value = (args[0] as NumberValue).value;
        execSync(`sleep ${value}`, {});
        return makeNull();
    })

    library.createFunction("loop", function(args: Runtime[], scope: Environment){
        //if(!(args[1] as FunctionValue).body) throw "no function found in call";
        if((args[0] as NumberValue).value < 1) throw "minimum loop amouns shouldn't be under 1";
    		const env = new Environment(scope);

		    let result: Runtime = makeNull();
	    	for(let i = 0; i < (args[0] as NumberValue).value; i++){
                for (const Statement of (args[1] as FunctionValue).body) {
		    	result = evaluate(Statement, env);
	    	}
        }
		return result;
    })
}