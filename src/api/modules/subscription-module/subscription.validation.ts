import { REQUIRED_STRING_SCHEMA } from "@/core/constants/validationSchema";
import { z } from "zod";

export class SubscriptionValidation {

    static createSubscriptionSchema = z.object({
       termId : REQUIRED_STRING_SCHEMA,
       studentId : REQUIRED_STRING_SCHEMA
    })
    
}