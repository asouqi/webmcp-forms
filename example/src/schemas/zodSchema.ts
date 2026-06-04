import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

const MIN_DATE = "2024-01-01"
const MAX_DATE = "2026-12-31"

/**
 * Example: A schema for a 'Creative Project' form that includes
 * types not typically handled well by basic declarative HTML forms.
 */
export const CustomFormSchema = z.object({
    // 1. FILE SUPPORT: AI doesn't 'upload' files directly, but can provide a URL or Base64
    projectAsset: z.string()
        .url("Must be a valid URL to the asset")
        .describe("A URL to the image or document you want to upload to the project"),

    // 2. COLOR PICKER: Native <input type="color"> returns hex
    brandColor: z.string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid Hex Color")
        .describe("The primary brand color in Hex format (e.g., #ff0000)"),

    // 3. RANGE/SLIDER: Ensuring the AI provides a specific numeric step/range
    difficultyLevel: z.number()
        .min(1)
        .max(10)
        .int()
        .describe("Set the project difficulty from 1 to 10"),

    // 4. MULTI-SELECT/TAGS: Supporting array-based inputs
    tags: z.array(z.string().min(2))
        .max(5, "Maximum 5 tags allowed")
        .describe("A list of keywords related to the project"),

    // 5. JSON/METADATA: Supporting complex nested objects
    extraMetadata: z.object({
        isPublic: z.boolean().default(true),
        priority: z.enum(['low', 'medium', 'high'])
    }).describe("Advanced configuration settings for the project"),

    // 6. DATE: Restricted to the year 2026
    appointmentDate: z.coerce.string().date()
        .refine((date) => new Date(date) >= new Date(MIN_DATE), { message: "Too early! Must be 2024-2026." })
        .refine((date) => new Date(date) <= new Date(MAX_DATE), { message: "Too late! Must be 2024-2026." }),

    // 7. FILE: Represented as an object for WebMCP/AI compatibility
    projectFile: z.object({
        name: z.string(),
        size: z.number().max(MAX_FILE_SIZE, "File must be under 5MB"),
        type: z.string().refine(type => ACCEPTED_IMAGE_TYPES.includes(type), "Only .jpg, .png, and .webp supported"),
        content: z.string() // Base64 content
    }),
})