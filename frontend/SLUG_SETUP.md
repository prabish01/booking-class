# Setting Up Slug-Based URLs for Class Occurrences

## Option 1: Add Slug Field in Strapi (Recommended)

### Steps:

1. Go to Strapi Admin Panel: `http://localhost:1337/admin`
2. Navigate to Content-Type Builder
3. Edit "Class Occurrence" content type
4. Add new field:
   - Type: Text
   - Name: `slug`
   - Required: Yes
   - Unique: Yes

### Auto-Generate Slugs (Optional)

Add this to your Strapi lifecycle hooks (`src/api/class-occurrence/content-types/class-occurrence/lifecycles.js`):

```javascript
const slugify = require("slugify");

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    if (data.title && !data.slug) {
      data.slug = slugify(data.title, { lower: true, strict: true });
    }
  },
  beforeUpdate(event) {
    const { data } = event.params;
    if (data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true });
    }
  },
};
```

## Option 2: Frontend-Only Solution (Temporary)

The current implementation will:

- Try to use the `slug` field if it exists
- Fall back to generating a slug from the title
- Support both slug and documentId URLs

## URL Examples:

- With slug: `/classes/class-1`
- With documentId: `/classes/loilzn6cqtcpe9xtgc6wdklq`
- Generated slug: `/classes/bollywood-fusion-basics`

## Testing:

1. Add slug field to your "class 1" entry: `class-1`
2. Visit: `http://localhost:3000/classes/class-1`
3. Should work the same as the documentId URL
