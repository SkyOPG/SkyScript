import colors from 'npm:colors';
import Environment from "../../../../environment.ts";
import { Runtime,StringValue } from "../../../../values.ts";

export default function(args: Runtime[], _scope: Environment){
    if((args[0] as StringValue).value !== null || (args[0] as StringValue).value !== undefined){
        const b = colors.red((args[0] as StringValue).value);
        return { type: "string", value: b } as StringValue;
    }
    const a = colors.red((args[0] as unknown) as string)
    return { type: "string", value: a } as StringValue;
}