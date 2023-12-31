import Environment from "../runtime/env.js";
import { Runtime, makeNum } from "../runtime/val.js";

export default ({ library }) => {
	library.createFunction("now", function(_args: Runtime[], _env: Environment) {
		return makeNum(Date.now());
	});
}