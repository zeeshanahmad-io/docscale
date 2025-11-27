import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: process.env.NODE_ENV === 'production'
        ? { kind: 'cloud' }
        : { kind: 'local' },
    cloud: {
        project: 'zeeshanahmad-io/docscale',
    },
    collections: {
        posts: collection({
            label: 'Posts',
            slugField: 'title',
            path: 'blogs/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                description: fields.text({ label: 'Description', multiline: true }),
                published_date: fields.date({ label: 'Published Date' }),
                author: fields.text({ label: 'Author' }),
                featuredImage: fields.image({
                    label: 'Featured Image',
                    directory: 'public/images',
                    publicPath: '/images',
                }),
                content: fields.markdoc({
                    label: 'Content',
                    extension: 'md',
                }),
            },
        }),
    },
});
