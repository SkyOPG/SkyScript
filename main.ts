import Parser from './frontend/parser.ts';
import Environment from './runtime/env.ts';
import { evaluate } from './runtime/interpeter.ts';

const file = Deno.env.get('File');
console.log(file)

if(file != ""){
    run(`${file}`);
} else {
    repl();
}

async function run(path: string){
    if(!file?.endsWith(".ss")) throw "file is not a .ss skyscript file";
    const parser = new Parser();
    const env = new Environment();
    const input = await Deno.readTextFile(path);
    const program = parser.produceAST(input);
    const result = evaluate(program, env);
    console.log(result)
}

function repl(){
    let DebugMode = false;
    const parser = new Parser();
    const env = new Environment();
    console.log("SkyScript REPL v0.0.1");
    while(true){
        const input = prompt("> ");

        if(!input){
            console.log("no input, exiting...");
            Deno.exit(1);
        }else if(input == "/exit"){
            console.log("exiting");
            Deno.exit(1);
        } else if(input == "/debug"){
            DebugMode = !DebugMode;
            console.log("Toggled Debug mode!");
        } else{
            const program = parser.produceAST(input);

        if(DebugMode){
            console.log(program);
        } else {
            const result = evaluate(program, env);
            console.log(result)
        }
        }
    }
}