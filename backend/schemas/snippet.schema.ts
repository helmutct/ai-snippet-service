import { z } from 'zod';

const CreateSnippetSchema = z.object({
  text: z
    .string({
      message: 'Text must be a string'
    })
    .min(10, 'Text must be at least 10 characters long')
    .max(50000, 'Text cannot exceed 50,000 characters')
    .trim()
    .refine(
      (text) => text.length > 0,
      'Text cannot be empty or only whitespace'
    ),
});

const QueryParamsSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val, 10) : 20)
    .refine((val) => val >= 1 && val <= 100, 'Limit must be between 1 and 100'),
  
  offset: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val, 10) : 0)
    .refine((val) => val >= 0, 'Offset must be >= 0'),
});

const ParamsSchema = z.object({
  id: z.string(),
});

export {
  CreateSnippetSchema,
  CreateSnippetSchema as CreateSnippetSchemaWithAI,
  QueryParamsSchema,
  ParamsSchema,
};