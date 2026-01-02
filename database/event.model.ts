import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Event document shape in MongoDB.
 */
export interface EventAttrs {
  title: string;
  slug?: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO 8601 date string (YYYY-MM-DD or full ISO)
  time: string; // 24h time string (HH:mm)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

export interface EventDoc extends EventAttrs, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface EventModel extends Model<EventDoc> {}

/**
 * Basic slugify helper to create URL-friendly slugs from titles.
 */
const slugify = (value: string): string => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-|-$/g, ''); // trim leading/trailing dash
};

/**
 * Normalize a date string to ISO (YYYY-MM-DD) if possible.
 * Throws if the date is invalid.
 */
const normalizeDate = (value: string): string => {
  const trimmed = value.trim();
  const date = new Date(trimmed);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid event date format');
  }

  // Keep only the date portion (YYYY-MM-DD)
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Normalize time to 24-hour HH:mm format.
 * Very small parser that accepts `HH:mm` or full ISO/time strings.
 */
const normalizeTime = (value: string): string => {
  const trimmed = value.trim();

  // If already looks like HH:mm, validate and return
  const hhmmMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(trimmed);
  if (hhmmMatch) {
    return trimmed;
  }

  // Fallback: try Date parsing and extract time portion
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid event time format');
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

/**
 * Event schema definition.
 */
const EventSchema = new Schema<EventDoc, EventModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean => Array.isArray(value) && value.length > 0,
        message: 'Agenda cannot be empty',
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean => Array.isArray(value) && value.length > 0,
        message: 'Tags cannot be empty',
      },
    },
  },
  {
    timestamps: true,
  },
);

// Ensure a unique index on slug at the schema level
EventSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-save hook to:
 * - validate required string fields are non-empty
 * - generate or regenerate slug when the title changes
 * - normalize date and time formats
 */
EventSchema.pre<EventDoc>('save', function (next) {
  const requiredStringFields: Array<keyof EventAttrs> = [
    'title',
    'description',
    'overview',
    'image',
    'venue',
    'location',
    'date',
    'time',
    'mode',
    'audience',
    'organizer',
  ];

  for (const field of requiredStringFields) {
    const value = this[field];
    if (typeof value !== 'string' || value.trim().length === 0) {
      return next(new Error(`Field "${String(field)}" is required and cannot be empty`));
    }
  }

  // Normalize date and time to predictable formats
  try {
    this.date = normalizeDate(this.date);
    this.time = normalizeTime(this.time);
  } catch (error) {
    return next(error as Error);
  }

  // Regenerate slug only when the title is new or modified
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title);
  }

  return next();
});

export const Event: EventModel =
  (mongoose.models.Event as EventModel | undefined) ||
  mongoose.model<EventDoc, EventModel>('Event', EventSchema);
