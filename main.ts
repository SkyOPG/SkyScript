import Parser from './syntax/parser.ts';
import { createGlobalEnv } from './runtime/environment.ts';
import { evaluate } from './runtime/interpreter.ts';
import _colors from 'colors';
import fs from 'fs'; 
import { SkyScriptWarn } from "./src/util/warn.ts";

const [node_exec, ss_path, file, ...args] = process.argv;

if(file === "-v" || file === "--version"){
    console.log("Sky"+_colors.cyan("Script"), "is on version: 0.0.4-a");
    process.exit(0);
}

if(file != undefined){
   runmain(`${file}`);
} else {
    repl();
}

function readFile(input){
    return fs.readFileSync(input).toString();
}

export function run(path: string){
    if(!file.endsWith(".ss") || !file.endsWith(".☁") || !file.endsWith(".ssk")) throw "file is not a skyscript file (.ss, .☁, .ssk)";
    const parser = new Parser();
    const env = createGlobalEnv();
    const input = readFile(path);
    const program = parser.createAST(input);
    const result = evaluate(program, env);
    if(args[0] === "-d" || args[0] === "--debug")
    console.log(result)
}

async function runmain(path: string){
    if(!file?.endsWith(".ss")) throw "file is not a .ss skyscript file";
    try{
    const parser = new Parser();
    const env = createGlobalEnv();
    const input = await Deno.readTextFile(path);
    const program = parser.createAST(input);
    /*const result =*/ evaluate(program, env);
    //console.log(result)
    } catch(e) {
        new SkyScriptWarn(e);
    }
}

function repl(){
    let DebugMode = false;
    const parser = new Parser();
    const env = createGlobalEnv();
    console.log("Sky"+_colors.cyan("Script"), "REPL v0.0.4-a");
    while(true){
        const input = prompt(_colors.green("> "));

        if(!input){
            continue
        }else if(input == "/exit"){
            console.log(_colors.red("exiting"));
            Deno.exit(1);
        } else if(input == "/debug"){
            DebugMode = !DebugMode;
            console.log(_colors.yellow("Toggled Debug mode!"));
        } else if(input == "/help"){
            console.log("All commands: \n- /exit: exit the repl\n- /debug: enable debug mode\n- /help: shows this menu")
        }else{
            const program = parser.createAST(input);

        if(DebugMode){
            console.log(program);
        } else {
            /*const result =*/ evaluate(program, env);
            //console.log(result)
        }
        }
    }
}