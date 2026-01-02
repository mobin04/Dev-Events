import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { Event } from './event.model';

/**
 * Booking attributes required to create a document.
 */
export interface BookingAttrs {
  eventId: Types.ObjectId;
  email: string;
}

export interface BookingDoc extends BookingAttrs, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingModel extends Model<BookingDoc> {}

/**
 * Simple email validation regex for basic format checks.
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<BookingDoc, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: Event.modelName,
      required: true,
      index: true, // index for faster lookups by event
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => emailRegex.test(value),
        message: 'Invalid email address',
      },
    },
  },
  {
    timestamps: true,
  },
);

// Explicit index on eventId (in addition to field index) for clarity
BookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook to:
 * - ensure referenced event exists
 * - guard against invalid email format (in addition to schema validator)
 */
BookingSchema.pre<BookingDoc>('save', async function (next) {
  if (!this.eventId) {
    return next(new Error('Booking must reference an eventId'));
  }

  if (!emailRegex.test(this.email)) {
    return next(new Error('Invalid email address'));
  }

  try {
    // Verify that the referenced event exists before saving the booking
    const eventExists = await Event.exists({ _id: this.eventId }).lean();

    if (!eventExists) {
      return next(new Error('Referenced event does not exist'));
    }

    return next();
  } catch (error) {
    return next(error as Error);
  }
});

export const Booking: BookingModel =
  (mongoose.models.Booking as BookingModel | undefined) ||
  mongoose.model<BookingDoc, BookingModel>('Booking', BookingSchema);
