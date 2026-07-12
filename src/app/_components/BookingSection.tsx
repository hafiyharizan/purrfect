'use client';

import { useState, type FormEvent } from 'react';
import { Calculator, CheckCircle2, Heart, PawPrint, UploadCloud } from 'lucide-react';
import {
  EXTRA_MINUTES_RATE_PER_VISIT,
  VISIT_PLANS,
  calculateBookingEstimate,
  validateBooking,
  type BookingRequestInput,
  type BookingStatus,
  type VisitFrequency,
} from '@/lib/bookings';
import { formatCurrency, pluralize } from '@/lib/format';
import { submitBooking } from '@/app/actions';
import { Field } from './ui';
import { FlowerSprig, SittingCat } from './icons';

const initialForm: BookingRequestInput = {
  ownerName: '',
  email: '',
  phone: '',
  addressSuburb: '',
  numberOfCats: 1,
  catNames: '',
  startDate: '',
  endDate: '',
  visitFrequency: 'single',
  extraMinutes: false,
  feedingInstructions: '',
  litterInstructions: '',
  specialCareNotes: '',
  emergencyContact: '',
  vetDetails: '',
  catPhotoName: '',
  confirmationConsent: false,
};

type Confirmation = { ownerName: string; status: BookingStatus; total: number };

export function BookingSection() {
  const [form, setForm] = useState<BookingRequestInput>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const estimate = calculateBookingEstimate(form);
  const plan = VISIT_PLANS[form.visitFrequency];
  const ratePerDay = plan.dailyRate + (form.extraMinutes ? EXTRA_MINUTES_RATE_PER_VISIT * plan.visitsPerDay : 0);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, type, value } = event.target;
    const field = name as keyof BookingRequestInput;

    setErrors((current) => ({ ...current, [field]: '' }));
    setConfirmation(null);

    if (type === 'checkbox') {
      const target = event.target as HTMLInputElement;
      setForm((current) => ({ ...current, [field]: target.checked }));
      return;
    }

    setForm((current) => ({
      ...current,
      [field]: type === 'number' || field === 'numberOfCats' ? Number(value) : value,
    }));
  };

  const handlePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setForm((current) => ({ ...current, catPhotoName: file?.name ?? '' }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateBooking(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    const result = await submitBooking(form);
    setSubmitting(false);

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setConfirmation({ ownerName: result.ownerName, status: result.status, total: result.total });
    setForm(initialForm);
  };

  return (
    <section className="section booking-section" id="booking">
      <div className="booking-heading">
        <h2>
          Book a Visit <Heart aria-hidden="true" size={22} />
        </h2>
        <p>We can’t wait to meet your kitty!</p>
        <SittingCat className="booking-cat" />
      </div>

      <div className="booking-layout">
        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid two-columns">
            <Field label="Owner Name" name="ownerName" error={errors.ownerName} required>
              <input id="ownerName" name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Enter your name" required />
            </Field>
            <Field label="Email Address" name="email" error={errors.email} required>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            </Field>
            <Field label="Phone Number" name="phone" error={errors.phone} required>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="04XX XXX XXX" required />
            </Field>
            <Field label="Suburb / Address" name="addressSuburb" error={errors.addressSuburb} required>
              <input id="addressSuburb" name="addressSuburb" value={form.addressSuburb} onChange={handleChange} placeholder="Enter suburb or full address" required />
            </Field>
            <Field label="Number of Cats" name="numberOfCats" error={errors.numberOfCats} required>
              <select id="numberOfCats" name="numberOfCats" value={form.numberOfCats} onChange={handleChange}>
                {[1, 2, 3, 4, 5, 6].map((count) => (
                  <option key={count} value={count}>
                    {count === 6 ? '6+' : count}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Cat Names" name="catNames" error={errors.catNames} required>
              <input id="catNames" name="catNames" value={form.catNames} onChange={handleChange} placeholder="e.g. Milo, Luna" required />
            </Field>
            <Field label="Start Date" name="startDate" error={errors.startDate} required>
              <input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
            </Field>
            <Field label="End Date" name="endDate" error={errors.endDate} required>
              <input id="endDate" name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
            </Field>
            <Field label="Preferred Visit Frequency" name="visitFrequency" error={errors.visitFrequency} required>
              <select id="visitFrequency" name="visitFrequency" value={form.visitFrequency} onChange={handleChange}>
                {(Object.keys(VISIT_PLANS) as VisitFrequency[]).map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {VISIT_PLANS[frequency].label} (${VISIT_PLANS[frequency].dailyRate})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Add Extra 30 Minutes?" name="extraMinutes">
              <div className="radio-row">
                <label>
                  <input
                    checked={form.extraMinutes}
                    id="extraMinutesYes"
                    name="extraMinutes"
                    onChange={() => setForm((current) => ({ ...current, extraMinutes: true }))}
                    type="radio"
                  />
                  Yes <small>(+${EXTRA_MINUTES_RATE_PER_VISIT} per visit)</small>
                </label>
                <label>
                  <input
                    checked={!form.extraMinutes}
                    id="extraMinutesNo"
                    name="extraMinutes"
                    onChange={() => setForm((current) => ({ ...current, extraMinutes: false }))}
                    type="radio"
                  />
                  No
                </label>
              </div>
            </Field>
          </div>

          <Field label="Feeding Instructions" name="feedingInstructions" error={errors.feedingInstructions} required>
            <textarea
              id="feedingInstructions"
              name="feedingInstructions"
              value={form.feedingInstructions}
              onChange={handleChange}
              placeholder="Tell us about food type, portion, schedule..."
              required
            />
          </Field>
          <Field label="Litter Instructions" name="litterInstructions" error={errors.litterInstructions} required>
            <textarea
              id="litterInstructions"
              name="litterInstructions"
              value={form.litterInstructions}
              onChange={handleChange}
              placeholder="Litter type, location, preferences..."
              required
            />
          </Field>
          <Field label="Medication / Special Care Notes" name="specialCareNotes">
            <textarea
              id="specialCareNotes"
              name="specialCareNotes"
              value={form.specialCareNotes}
              onChange={handleChange}
              placeholder="Any medication, health or special care we should know..."
            />
          </Field>

          <div className="form-grid two-columns">
            <Field label="Emergency Contact" name="emergencyContact" error={errors.emergencyContact} required>
              <input
                id="emergencyContact"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleChange}
                placeholder="Name and phone number"
                required
              />
            </Field>
            <Field label="Vet Details" name="vetDetails" error={errors.vetDetails} required>
              <input
                id="vetDetails"
                name="vetDetails"
                value={form.vetDetails}
                onChange={handleChange}
                placeholder="Clinic name and phone number"
                required
              />
            </Field>
          </div>

          <span className="upload-label">Upload a Photo of Your Cat (optional)</span>
          <label className="upload-box">
            <UploadCloud aria-hidden="true" size={26} />
            <span>
              <strong>{form.catPhotoName || 'Click to upload or drag and drop'}</strong>
              <small>JPG, PNG up to 5MB</small>
            </span>
            <input accept="image/*" onChange={handlePhoto} type="file" />
          </label>

          <label className={`consent-row ${errors.confirmationConsent ? 'has-error' : ''}`}>
            <input
              checked={form.confirmationConsent}
              id="confirmationConsent"
              name="confirmationConsent"
              onChange={handleChange}
              type="checkbox"
            />
            <span>I understand booking is subject to confirmation. <em>*</em></span>
          </label>
          {errors.confirmationConsent && <p className="field-error">{errors.confirmationConsent}</p>}

          <button className="primary-button form-submit" type="submit" disabled={submitting}>
            <PawPrint aria-hidden="true" size={19} />
            {submitting ? 'Sending…' : 'Request Booking'}
          </button>

          {errors.form && <p className="field-error">{errors.form}</p>}

          {confirmation && (
            <div className="success-message" role="status">
              <CheckCircle2 aria-hidden="true" size={22} />
              <span>
                Thank you, {confirmation.ownerName}. Your request was saved as {confirmation.status.toLowerCase()} with an estimated total of {formatCurrency(confirmation.total)}.
              </span>
            </div>
          )}
        </form>

        <div className="booking-side">
          <aside className="estimate-panel" aria-live="polite">
            <div className="estimate-title">
              <span>Estimated Total</span>
              <Calculator aria-hidden="true" size={22} />
            </div>
            <dl>
              <div>
                <dt>Duration</dt>
                <dd>{pluralize(estimate.days, 'day')}</dd>
              </div>
              <div>
                <dt>Visits per day</dt>
                <dd>{pluralize(estimate.visitsPerDay, 'visit')}</dd>
              </div>
              <div>
                <dt>Extra 30 mins</dt>
                <dd>{form.extraMinutes ? 'Yes' : 'No'}</dd>
              </div>
              <div>
                <dt>Rate per day</dt>
                <dd>${ratePerDay}</dd>
              </div>
            </dl>
            <span className="estimate-label">Estimated total</span>
            <strong>{formatCurrency(estimate.total)}</strong>
            <p>Final price may vary if outside service area or for customized packages.</p>
          </aside>
          <SittingCat className="side-cat" />
          <FlowerSprig className="flower side-flower" />
        </div>
      </div>
    </section>
  );
}
