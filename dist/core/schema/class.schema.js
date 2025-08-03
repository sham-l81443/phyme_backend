"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.classSchema = zod_1.z.object({
    name: common_1.SCHEMA.name,
    code: common_1.SCHEMA.uniqueCode,
    syllabusId: common_1.SCHEMA.required,
    description: common_1.SCHEMA.description
});
