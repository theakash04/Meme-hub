"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
app_1.default.get("/", (_req, res) => {
    res.json({ "test": "Express server" });
});
app_1.default.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
