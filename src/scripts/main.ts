import modular from "modujs";
import * as modules from "./modules";

const app = new modular({
	modules: modules,
});

app.init(app);
