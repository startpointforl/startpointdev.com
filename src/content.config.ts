import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

// Цикл статей: src/content/series/<id>.md. Тело файла — вступление на странице цикла.
const series = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const articles = defineCollection({
  // id статьи = поле slug из frontmatter, иначе имя файла. Он же становится URL: /blog/<id>/
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/articles',
    generateId: ({ entry, data }) => (data.slug as string | undefined) ?? entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'slug: только латиница, цифры и дефисы').optional(),
    lang: z.enum(['ru', 'en']).default('ru'),
    tags: z.array(z.string()).default([]),
    // Цикл, к которому относится статья, и номер части в нём. У отдельных статей полей нет.
    series: reference('series').optional(),
    part: z.number().int().positive().optional(),
    // Своя обложка для превью (путь от /public), иначе сгенерируется автоматически
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }).refine((d) => !d.series === !d.part, { message: 'series и part задаются вместе' }),
});

const talks = defineCollection({
  loader: file('./src/data/talks.yaml'),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    event: z.string(),
    date: z.coerce.date(),
    // Для старых докладов без точной даты
    dateLabel: z.string().optional(),
    city: z.string().optional(),
    format: z.enum(['offline', 'online', 'hybrid']),
    lang: z.enum(['ru', 'en']).default('ru'),
    video: z.string().url().optional(),
    slides: z.string().url().optional(),
    page: z.string().url().optional(),
    note: z.string().optional(),
    noteEn: z.string().optional(),
  }),
});

export const collections = { series, articles, talks };
